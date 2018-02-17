import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View
} from 'react-native';

import styles from './styles.js';

import { PRIMARY_LIGHT } from '../../masterStyle.js'

import QRCode from 'react-native-qrcode-svg';

export default class QRScreen extends Component<{}>  {

  constructor(props) {
    super(props);
    this.state = {
        text: "http://google.com/"+firebaseService.auth().currentUser.uid.toString(),
        logo: require("../../Pictures/logo.png")};
  }

  render() {
    return (
      <View style={styles.Container}>
        <QRCode
          value={this.state.text}
          size={250}
          color={PRIMARY_LIGHT}
          logo={this.state.logo}
          logoSize={75}
          logoBorderRadius={100}
          logoMargin={2}/>
      </View>
    );
  };
}