/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import {
  Alert,
  Platform,
  View
} from 'react-native';

import { 
  Button,
  Header,
  Tab,
  TabHeading,
  Tabs,
  Text
} from 'native-base';

import { Icon } from 'react-native-elements'

import RNFetchBlob from 'react-native-fetch-blob';

import { Provider } from 'react-redux';
import { configureStore } from './store';
const store = configureStore();

import ChatApp from './Screens/InitialScreen/ChatApp';

export default class App extends Component<{}> {

  constructor(props)  {

    super(props);
    this.state={
      realm: null,
      user: null
    };
  }

  componentWillMount () {
  }

  render()  {

    return (
      <Provider store={store}>
        <ChatApp />
      </Provider>
    );
  }
}
