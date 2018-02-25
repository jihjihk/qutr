import React, { Component } from 'react';
import {
  	Button,
    Icon
} from 'native-base';
import styles from './styles.js';
import PropTypes from 'prop-types';

export default class ToolbarButton extends Component {

  static propTypes = {
    onPress: PropTypes.func,
  }

  constructor(props)  {
    super(props);
  }

  render = () => {

    return (
        <Button transparent 
                style={[styles.alignment]} 
                onPress={this.props.onPress}>
          <Icon name={this.props.name} 
                style={[styles.button, this.props.style]}/>
          {this.props.children}
        </Button>
    );
  }
}