import React from 'react';
import { Provider } from 'react-redux';

import { configureStore } from './app/store';

import ChatApp from './app/components/ChatApp';

const store = configureStore();

const App = () =>
  <Provider store={store}>
    <ChatApp />
  </Provider>

export default App;
