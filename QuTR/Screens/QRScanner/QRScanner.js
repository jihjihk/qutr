import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

import styles from './styles.js';

const Firebase = require('firebase');
var self;

export default class QRScanner extends Component<{}>  {

  constructor(props) {
    super(props);
    self=this;
    this.state={
      user: firebaseService.auth().currentUser
    }
  }

  componentWillMount() {

    this.loadConversationIntoState();
  }

  componentWillUnmount () {

    firebaseService.database().ref()
    .child('users')
    .child(this.state.user.uid)
    .off('value');
  }

  loadConversationIntoState = () => {

    firebaseService.database().ref()
    .child('users')
    .child(this.state.user.uid)
    .on('value', function(snapshot) {
      var conversation = snapshot.val().conversation;
      if (!!conversation) {
        self.setState({conversation: conversation});
      }
    })
  }

  onSuccess(e) {

    if (!!self.state.conversation) {
      firebaseService.database().ref()
      .child('conversations')
      .child(self.state.conversation)
      .remove(function() {
        self.processNewConversation(e);
      });
    }
    else this.processNewConversation(e);
  }

  processNewConversation = (e) => {
    var eSplit = e.data.split("/");
    var theirKey = eSplit[eSplit.length-1];
    var myKey = firebaseService.auth().currentUser.uid;
    var newChatKey = firebaseService.database().ref().child('chats/').push().key; /* Key of the new conversation */
    var date = Firebase.database.ServerValue.TIMESTAMP;
    
    var convInfo = {"timestamp": date, 
                    "ID1": myKey, "ID2": theirKey};

    this.createConversation(newChatKey, convInfo);
      
    /* Redirect user to ConversationsScreen upon a successful scan */
    setTimeout(function() {self.props.changeTab(1)}, 750);
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
                       reactivate={true}
                       reactivateTimeout={5000}/>
      </View>
    );
  };
};