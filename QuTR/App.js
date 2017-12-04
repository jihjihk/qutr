/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import ChatScreen from './Screens/ChatScreen/ChatScreen.js';
import ConversationsScreen from './Screens/ConversationsScreen/ConversationsScreen.js';
import ProfileScreen from './Screens/ProfileScreen/ProfileScreen.js';

import { UserSchema, MessageSchema, ConversationSchema } from './Schemas.js';

const Realm = require('realm');

const SimpleApp = StackNavigator({
  Conversations: { screen: ConversationsScreen },
  Chat: { screen: ChatScreen },    
  Profile: { screen: ProfileScreen },
});

export default class App extends Component<{}> {

  constructor(props)  {

    super(props);
  }

  componentWillMount()  {
    
  }

  render() {
    return <SimpleApp/>;
  }
}
