import React, { Component } from 'react';
import {
  ScrollView
} from 'react-native';

import { Container, 
         Title
       } 
from 'native-base';
import { StackNavigator } from 'react-navigation';

import Header from '../../Components/header/Header.js';

import styles from './styles.js';

import { NavigationActions } from 'react-navigation';

export default class ConnectionScreen extends Component<{}>  {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  componentWillUnmount () {

    that=this;
  }

  componentWillReceiveProps () {

  }

  componentWillUnmount () {
  }

  render() {
    return (<Container ref="container" style={[styles.Container]}>
              <Header center={<Title style={[styles.Title]}>Connectivity</Title>}/> 
              <ScrollView>
              </ScrollView>
            </Container>
    );
  }
}