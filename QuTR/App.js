import React, { Component } from 'react';

import { Provider } from 'react-redux';
import { configureStore } from './store';
const store = configureStore();

import ChatApp from './Screens/InitialScreen/ChatApp';

import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class App extends Component<{}> {

  constructor(props)  {

    super(props);
  }

  render()  {

    return (
      <Provider store={store}>
        <ChatApp />
      </Provider>
    );
  }
}
