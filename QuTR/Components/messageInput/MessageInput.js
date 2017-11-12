import React, { Component } from 'react';
import {
	Input,
} from 'native-base';
import { Keyboard } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles.js';

export default class MessageInput extends Component {

  constructor(props) {
    super(props);
    this.state = {message: ''};
  }

  static propTypes = {
    onChangeText: PropTypes.func,
  }

  clearContent = () =>  {

    this.logAllProperties(this.input, '');
    this.setState({message: ''});
  }

  setText = (input) => {
    this.logAllProperties(this.input, input);
    this.setState({message: input});
  }

  logAllProperties = (obj, newText) => {
       if (obj == null) return; // recursive approach
       if (Object.getPrototypeOf(obj).setNativeProps!=null) {
          obj.setNativeProps({text: newText});
          return;
       }       
       this.logAllProperties(Object.getPrototypeOf(obj));
  }

  render = () => {

    return (
        <Input style={[styles.textInput]} ref={(input) => { this.input = input; }} multiline={false} placeholder='Enter message: ' autoCorrect={false} 
        onChangeText={(value) => {this.props.onChangeText(value)}} onSubmitEditing={Keyboard.dismiss}/>
    );
  }
}