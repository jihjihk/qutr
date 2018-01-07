import React, { Component } from 'react';
import {
  	ScrollView,
    KeyboardAvoidingView,
    View,
    Keyboard
} from 'react-native';

import Message from './../message/Message.js';

import styles from './styles.js';

export default class ConversationsWindow extends Component {

  constructor(props) {
    super(props);
  }

  render = () => {

    var conversations=[];

    return (
          <ScrollView style={[styles.sw, this.props.style]} scrollEnabled={true}>
               {this.props.children}
               {conversations}
          </ScrollView>
    );
  }
}