import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

import styles from './styles.js';

const Firebase = require('firebase');

export default class QRScanner extends Component<{}>  {

  constructor(props) {
    super(props);
    this.state={
      user: firebaseService.auth().currentUser,
      myID: firebaseService.auth().currentUser.uid
    }
  }

  componentWillMount() {

    this.loadConversationIntoState();
  }

  componentWillUnmount () {

    firebaseService.database().ref()
    .child('users')
    .child(this.state.myID)
    .off('value');
  }

  loadConversationIntoState = () => {

    firebaseService.database().ref()
    .child('users')
    .child(this.state.myID)
    .on('value', (snapshot) => {
      var conversation = snapshot.val().conversation;
      if (!!conversation) {
        this.setState({conversation: conversation});
      }
    })
  }

  onSuccess(e) {

    if (!this.props.active) return;

    var eSplit = e.data.split("/");
    var theirKey = eSplit[eSplit.length-1];

    /* Can't scan own code */
    if (theirKey==this.state.myID)  return;

    if (!!this.state.conversation) {
      firebaseService.database().ref()
      .child('conversations')
      .child(this.state.conversation)
      .remove(() => {
        this.processNewConversation(theirKey);
      });
    }
    else this.processNewConversation(theirKey);
  }

  processNewConversation = (theirKey) => {
    
    var myKey = this.state.myID;
    var newChatKey = firebaseService.database().ref().child('chats/').push().key; /* Key of the new conversation */
    var date = Firebase.database.ServerValue.TIMESTAMP;
    
    var convInfo = {"timestamp": date, 
                    "ID1": myKey, "ID2": theirKey,
                    [myKey]: false,
                    [theirKey]: false};

    this.createConversation(newChatKey, convInfo);
      
    /* Redirect user to ChatScreen upon a successful scan */
    setTimeout(() => {this.props.changeTab(1)}, 250);
  }

  createConversation = (chatKey, message) => {

    var key1 = message.ID1;
    var key2 = message.ID2;

    firebaseService.database().ref()
    .child('conversations')
    .child(chatKey)
    .set(message);

    firebaseService.database().ref()
    .child('users')
    .child(key1)
    .update({'conversation': chatKey});

    firebaseService.database().ref()
    .child('users')
    .child(key2)
    .update({'conversation': chatKey});


  }

  render() {
    return (
      <View style={styles.Container}>
        <QRCodeScanner onRead={ this.onSuccess.bind(this) }
                       cameraStyle = {[styles.Scanner, this.props.style]}
                       reactivate={false}/>
      </View>
    );
  };
};