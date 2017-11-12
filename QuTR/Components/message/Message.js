import React, { Component } from 'react';
import {
  	Text,
} from 'react-native';
import styles from './styles.js';


export default class Message extends Component {

  render = () => {

    return (
        <Text style={[styles.message, this.props.style]}>
        	{this.props.message}
        </Text>
    );
  }
}