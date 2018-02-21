import React, { Component } from 'react';
import {
	Input,
} from 'native-base';
import { Keyboard,
         Alert,
         Text} from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles.js';
import { PRIMARY_LIGHT } from '../../masterStyle.js'

export default class MessageInput extends Component {

  constructor(props) {
    super(props);
    this.state = {message: '',
                  renderPreviousSelections: [],
                  previousSelections: []};
  }

  static propTypes = {
    onChangeText: PropTypes.func,
  }

  clearContent = () =>  {

    this.logAllProperties(this.input, '');
    this.setState({message: '',
                   renderPreviousSelections: [],
                   previousSelections: []});
  }

  setText = (input) => {
    var selection = [];
    selection.push(<Text style={{backgroundColor: PRIMARY_LIGHT, borderRadius: 30, borderWidth: 1, color: 'white'}}
                                  overflow='hidden'
                                  key={this.state.previousSelections.length}>
                      {input}
                    </Text>);
    selection.push(<Text> </Text>);


    this.setState({renderPreviousSelections: this.state.renderPreviousSelections.concat(selection),
                   message: this.state.message+=input+" ",
                   previousSelections: this.state.previousSelections.concat([input])});
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
               multiline={false} 
               placeholder='Enter message: ' 
               autoCorrect={false} 
               onChangeText={(value) => {this.props.onChangeText(value)}} 
               onSubmitEditing={Keyboard.dismiss}>
          {this.state.renderPreviousSelections}
        </Input>

    );
  }
}