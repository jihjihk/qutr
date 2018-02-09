import React, { Component } from 'react';
import {
  View
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
    Linking.openURL(e.data).catch(err => console.error('An error occured', err));
  }

  render() {
    return (
      <View style={styles.Container}>
        <QRCodeScanner onRead={ this.onSuccess.bind(this) }
                       cameraStyle = {styles.Scanner}/>
      </View>
    );
  };
}