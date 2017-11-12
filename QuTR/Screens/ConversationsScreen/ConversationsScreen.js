import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Keyboard,
} from 'react-native';
import { Container, Title, Text, } from 'native-base';
import { StackNavigator } from 'react-navigation';
import ActionButton from 'react-native-action-button';

import ToolbarButton from '../../Components/toolbarButton/ToolbarButton.js'
import Header from '../../Components/header/Header.js';
import ConversationsWindow from '../../Components/conversationsWindow/ConversationsWindow.js';
import Conversation from '../../Components/conversation/Conversation.js';

import styles from './styles.js';

import { TBBUTTON } from '../../masterStyle.js'

export default class ChatScreen extends Component<{}>  {

  static navigationOptions = ({ navigation }) => ({
    header: (
        <Header center={<Title style={[styles.Title]}>MY CONVERSATIONS</Title>} left={<ToolbarButton name='md-settings' onPress={() => that.props.navigation.navigate('Profile')}/>}/>
        ),
  });

  constructor(props) {
    super(props);
    var that;
  }

  componentWillMount () {
    that=this;
  }

  componentWillUnmount () {
  }

  render() {

    return (
      <Container ref="container">
        <ConversationsWindow ref="cw">
          <Conversation onPress={() => this.props.navigation.navigate('Chat', {name: "MERCHANT"})} sender="MERCHANT" message="See you then, by the way I will make sure to do the job!" date="11/11/2017" time="5:33PM" picture={{source: require("../../Pictures/merchant.png")}}/>
          <Conversation onPress={() => this.props.navigation.navigate('Chat', {name: "COUNTER ATTENDANT"})} sender="COUNTER ATTENDANT" message="Goodbye!" date="05/11/2017" time="2:29PM" picture={{source: require("../../Pictures/counter.png")}}/>
          <Conversation onPress={() => this.props.navigation.navigate('Chat', {name: "TAXI DRIVER"})} sender="TAXI DRIVER" message="Thanks." date="01/11/2017" time="11:14AM" picture={{source: require("../../Pictures/driver.jpg")}}/>
        </ConversationsWindow>
        <ActionButton></ActionButton>
      </Container>
   );
  }
}