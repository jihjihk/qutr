import React, { Component } from 'react';
import {
	Input,
} from 'native-base';
import { Keyboard,
         Alert,
         Text} from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles.js';
import { PRIMARY,
         SECONDARY } from '../../masterStyle.js'

export default class MessageInput extends Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    onChangeText: PropTypes.func,
  }

  clearContent = () =>  {

    this.logAllProperties(this.input, '');
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
        <Input style={[styles.textInput, this.props.style]} 
               ref={(input) => { this.input = input; }} 
               multiline={true} 
               placeholder={this.props.placeholder} 
               autoCorrect={false} 
               onChangeText={(value) => {this.props.onChangeText(value)}} 
               onSubmitEditing={Keyboard.dismiss}
               overflow='hidden'>
        </Input>

    );
  }
}