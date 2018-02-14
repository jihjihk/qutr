import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View,
  Alert,
  ToastAndroid
} from 'react-native';

import {
  Label
} from 'native-base'

import QRCodeScanner from 'react-native-qrcode-scanner';

import styles from './styles.js';

export default class QRCodeScreen extends Component<{}>  {

  constructor(props) {
    super(props);
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

    var newChatKey = firebaseService.database().ref().child('chats/').push().key;

    firebaseService.database().ref()
      .child('users')
      .child(firebaseService.auth().currentUser.uid)
      .child('userRooms')
      .child(newChatKey)
      .set({"message": "", "timestamp":"", correspondent: theirKey});

    firebaseService.database().ref()
    .child('users')
    .child(theirKey)
    .child('userRooms')
    .child(newChatKey)
    .set({"message": "", "timestamp":"", correspondent: firebaseService.auth().currentUser.uid});

    firebaseService.database().ref()
    .child('chats')
    .child(newChatKey)
    .push({"senderID": "", "message": ""});

    ToastAndroid.show("Scan successful!", ToastAndroid.SHORT);
    this.props.changeTab(1);
  }

  render() {
    return (
      <View style={styles.Container}>
        <QRCodeScanner onRead={ this.onSuccess.bind(this) }
                       cameraStyle = {styles.Scanner}
                       reactivate={false}/>
      </View>
    );
  };
}