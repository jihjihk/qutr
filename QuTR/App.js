/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { configureStore } from './store';
const store = configureStore();

import ChatApp from './Screens/InitialScreen/ChatApp';

export default class App extends Component<{}> {

  constructor(props)  {

    super(props);
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
