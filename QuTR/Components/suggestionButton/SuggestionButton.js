import React, { Component } from 'react';
import {
    Text,
} from 'native-base';
import {
    TouchableHighlight,
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
        <TouchableHighlight underlayColor={SECONDARY} 
                            style={[styles.container, this.props.style]} 
                            onPress = { () => {this.props.toSelect(this.props.text, this.props.id)}}>
          <View onStartShouldSetResponder={() => true}>
            <ScrollView vertical
                        showsVerticalScrollIndicator = {true}>
              <Text style={[styles.text]}>{this.props.text}</Text>
            </ScrollView>
          </View>
        </TouchableHighlight> 
    );
  }
}