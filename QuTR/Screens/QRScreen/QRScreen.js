import React, { Component } from 'react';
import {
  View
} from 'react-native';

import {
  Label
} from 'native-base'

import styles from './styles.js';

import { BLACK, 
         PRIMARY_LIGHT } from '../../masterStyle.js'

import QRCode from 'react-native-qrcode-svg';

/* Instead of the QR scanner, start with a QR code integrated with the app's logo - see QR Starbucks logo example */
/* FIle an Invention Report */

export default class QRScreen extends Component<{}>  {

  constructor(props) {
    super(props);
    this.state = {
        text: "Changed",
        logo: require("../../Pictures/logo.png")};
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
        <QRCode
          value={this.state.text}
          size={300}
          color={PRIMARY_LIGHT}
          logo={this.state.logo}
          logoSize={100}
          logoBorderRadius={100}
          logoMargin={4}/>
      </View>
    );
  };
}