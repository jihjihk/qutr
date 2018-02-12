import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View,
  Alert
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
    Alert.alert("", eSplit[eSplit.length-1]);

  }

  render() {
    return (
      <View style={styles.Container}>
        <QRCodeScanner onRead={ this.onSuccess.bind(this) }
                       cameraStyle = {styles.Scanner}
                       reactivate = {false}/>
      </View>
    );
  };
}