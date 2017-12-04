import React, { Component } from 'react';
import {
  	Text,
    View,
} from 'native-base';

import styles from './styles.js';

export default class ProfileFormItem extends Component {

  constructor(props)  {
    super(props);
  }

  render = () => {

    return (
        <View style={[styles.formItem, this.props.style]}>
          <Text style={[styles.formLabel]}>{this.props.label}: </Text>
          <View style={[styles.formTextInput]}>
            {this.props.children}
          </View>
        </View>
    );
  }
}