import React, { Component } from 'react';
import {
  View,
  } from 'react-native';

import styles from './styles.js';

export default class Header extends Component {

  constructor(props)  {
    super(props);
  }

  render = () => {

    return (
        <View style={[styles.Header]}>
          <View style={[styles.Side]}>
            {this.props.left}
          </View>
          <View style={[styles.Body]}>
            {this.props.center}
          </View>
          <View style={[styles.Side]}>
            {this.props.right}
          </View>            
        </View>
    );
  }
}