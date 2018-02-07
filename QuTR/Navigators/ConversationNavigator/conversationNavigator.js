import React, { Component } from 'react';

import { Alert } from 'react-native';

import { StackNavigator } from 'react-navigation';

import ChatScreen from '../../Screens/ChatScreen/ChatScreen.js';
import ConversationsScreen from '../../Screens/ConversationsScreen/ConversationsScreen.js';

const SimpleApp = StackNavigator({
  Conversations: { screen: ConversationsScreen },
  Chat: { screen: ChatScreen }
});

export default class ConversationNavigator extends Component<{}> {

  constructor(props)  {

    super(props);
  }

  render() {
    return (<SimpleApp screenProps={this.props.screenProps}/>);
  }
}