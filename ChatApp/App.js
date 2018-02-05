/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { configureStore } from './src/store';

import Chat from './src/components/Chat';

const store = configureStore();

const App = () => {
  <Provider store={store}>
    <Chat />
  </Provider>
};

export default App;
