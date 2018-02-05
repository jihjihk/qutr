/**
 * An messaging App made with React Native and Firebase
 * Adapted from this example: https://github.com/rubygarage/react-native-firebase-chat
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
