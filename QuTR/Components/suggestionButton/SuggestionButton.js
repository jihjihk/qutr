import React, { Component } from 'react';
import {
    Text,
} from 'native-base';
import {
    TouchableOpacity,
    ScrollView,
    View
} from 'react-native';

import {
  SECONDARY
} from '../../masterStyle.js';

import styles from './styles.js';

export default class SuggestionButton extends Component {

  constructor(props)  {
    super(props);
  }

  render = () => {

    return (
        <TouchableOpacity underlayColor={SECONDARY} 
                            style={[styles.container, this.props.style]} 
                            onPress = { () => {this.props.toSelect(this.props.text, this.props.id)}}>
          <Text style={[styles.text]}>{this.props.text}</Text>
        </TouchableOpacity> 
    );
  }
}