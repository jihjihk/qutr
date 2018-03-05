import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';

import styles from './styles.js';

const Firebase = require('firebase');
var self;

export default class QRCodeScreen extends Component<{}>  {

  constructor(props) {
    super(props);
    self=this;
  }

  componentWillMount() {
  }

  componentWillUnmount () {

  }

  componentWillReceiveProps () {

  }

  onSuccess(e) {
   
    var eSplit = e.data.split("/");
    var theirKey = eSplit[eSplit.length-1];
    var myKey = firebaseService.auth().currentUser.uid;
    var newChatKey = firebaseService.database().ref().child('chats/').push().key; /* Key of the new conversation */
    var date = Firebase.database.ServerValue.TIMESTAMP;
    var reverseDate = 0 - new Date().getTime();

    /* Get information about the other user */
    firebaseService.database().ref()
    .child('users')
    .child(theirKey)
    .once('value')
    .then(function(snapshot) {
      
      var theirName = snapshot.val().name;
      var theirPicture = snapshot.val().picture;

      /* Get information about me */
      firebaseService.database().ref()
      .child('users')
      .child(myKey)
      .once('value')
      .then(function(snapshot) {

        var myName = snapshot.val().name;
        var myPicture = snapshot.val().picture;

        /* These two objects are used for rendering appropriate
           Conversation items in the ConversationScreen */
        var myConvInfo = {"message": "", "theirPicture": theirPicture,
                        "timestamp": date, "reverseTimestamp": reverseDate,
                        "myName": myName, "theirName": theirName, 
                        "myID": myKey, "theirID": theirKey};

        var theirConvInfo = {"message": "", "theirPicture": myPicture,
                             "timestamp": date, "reverseTimestamp": reverseDate,
                             "myName": theirName, "theirName": myName, 
                             "myID": theirKey, "theirID": myKey};

        self.writeToUserRooms(myKey, newChatKey, myConvInfo);
        self.writeToUserRooms(theirKey, newChatKey, theirConvInfo);
      });

      /* Redirect user to ConversationsScreen upon a successful scan */
      self.props.changeTab(1);
    });
  }

  writeToUserRooms = (userKey, chatKey, message) => {

    firebaseService.database().ref()
    .child('users')
    .child(userKey)
    .child('userRooms')
    .child(chatKey)
    .set(message);
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