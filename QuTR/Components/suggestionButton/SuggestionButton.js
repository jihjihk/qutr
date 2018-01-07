import React, { Component } from 'react';
import {
  	Text,
} from 'native-base';
import {
    TouchableHighlight
} from 'react-native';

import {
  GREYUNDERLAY
} from '../../masterStyle.js';

import styles from './styles.js';

export default class SuggestionButton extends Component {

  constructor(props)  {
    super(props);
  }

  render = () => {

    console.log(this.props);

    return (
        <TouchableHighlight underlayColor={GREYUNDERLAY} 
                            style={[styles.container, this.props.style]} 
                            onPress = {() => this.props.toSelect(this.props.text)}>
          <Text style={[styles.text]}>{this.props.text}</Text>
        </TouchableHighlight> 
    );
  }
}