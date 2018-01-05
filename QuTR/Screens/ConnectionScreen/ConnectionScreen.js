import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';

export default class ConnectionScreen extends Component<{}>  {

  constructor(props) {
    super(props);
    console.log(props);
    this.state={navigation: this.props.navigation};
    var that;
  }

  componentWillMount() {
    console.log(this.state.navigation);
  }

  componentWillUnmount () {

    that=this;
  }

  componentWillReceiveProps () {

  }

  componentWillUnmount () {
  }

  render() {
    return <View style={{backgroundColor: 'red'}}></View>
  }
}