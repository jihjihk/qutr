import React, { Component } from 'react';
import {
  View
} from 'react-native';

import {
  Label
} from 'native-base'

import QRCode from 'react-native-qrcode';

import styles from './styles.js';

import { BLACK, 
         PRIMARY_LIGHT } from '../../masterStyle.js'

/* Instead of the QR scanner, start with a QR code integrated with the app's logo - see QR Starbucks logo example */
/* FIle an Invention Report */

export default class QRScreen extends Component<{}>  {

  constructor(props) {
    super(props);
    this.state = {
        text: "My Own Text"
    };
  }

  componentWillMount() {
  }

  componentWillUnmount () {

  }

  componentWillReceiveProps () {

  }

  render() {
    return (
      <View style={styles.Container}>
        <Label style={{fontSize: 20, color: PRIMARY_LIGHT, marginBottom: 30, borderBottomWidth: 2, borderBottomColor: BLACK}}>My QR Code: </Label>
        <QRCode
          value={this.state.text}
          size={250}
          bgColor='black'
          fgColor='white'/>
      </View>
    );
  };
}