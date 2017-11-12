import React, { Component } from 'react';
import {
  	Text,
    View,
} from 'native-base';

import SuggestionButton from './../suggestionButton/SuggestionButton.js';

import styles from './styles.js';

export default class SuggestionBar extends Component {

  constructor(props)  {
    super(props);
    this.state = {viewStyle: [styles.withoutKeyboard],
                  content: {text1: '', text2: '', text3: ''},
                  selectedText: ''};
  }

  onKeyboardShow()  {
    this.setState({viewStyle: [styles.withKeyboard]});
  }

  onKeyboardHide()  {
    this.setState({viewStyle: [styles.withoutKeyboard]});
  }

  populate(input)  {
    
    if (input!=='') this.setState({content: {text1: input+'1', text2: input+'2', text3: input+'3'}});
    else this.clean();
  }

  clean()  {
    this.setState({content: {text1: '', text2: '', text3: ''}});
  }

  render = () => {

    return (
        <View style={[this.state.viewStyle]}>
          <SuggestionButton text={this.state.content.text1} onPress = {(input) => this.props.onChildPressed(input)}></SuggestionButton>
          <SuggestionButton text={this.state.content.text2} onPress = {(input) => this.props.onChildPressed(input)}></SuggestionButton> 
          <SuggestionButton text={this.state.content.text3} onPress = {(input) => this.props.onChildPressed(input)}></SuggestionButton>
        </View> 
    );
  }
}