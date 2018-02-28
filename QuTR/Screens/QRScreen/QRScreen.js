import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View
} from 'react-native';

import styles from './styles.js';

import { PRIMARY_LIGHT } from '../../masterStyle.js'

import QRCode from 'react-native-qrcode-svg';

var self;

export default class QRScreen extends Component<{}>  {

  constructor(props) {
    super(props);
    this.state = {
        text: "http://google.com/"+firebaseService.auth().currentUser.uid.toString(),
        logo: require("../../Pictures/logo.png")};
    self = this;
  }

  componentDidMount() {

    var urref = firebaseService.database().ref()
                .child('users')
                .child(firebaseService.auth().currentUser.uid)
                .child('userRooms');

    urref.on("child_added", function(snapshot, prevChildKey) {
      var time = new Date();
      var ms = time.getTime();
      /* Only change the tab if I know that I've been scanned successfuly */
      if (snapshot.val().message==="" && Math.abs(snapshot.val().timestamp - ms) < 3000)
        self.props.changeTab(1);
    });
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