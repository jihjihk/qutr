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

import { UserSchema, MessageSchema, ConversationSchema } from '../../Schemas.js';

import styles from './styles.js';
import { TBBUTTON } from '../../masterStyle.js';

const Realm = require('realm');

const pictures = {"MERCHANT": require("../../Pictures/merchant.png"),
                  "COUNTER ATTENDANT": require("../../Pictures/counter.png"),
                  "TAXI DRIVER": require("../../Pictures/driver.jpg")}

export default class ConversationsScreen extends Component<{}>  {

  constructor(props) {
    super(props);
    this.state= {realm: null,
                 user: null};
  }

  static navigationOptions = { header: null };

  componentWillMount () {
    Realm.open({
      schema: [UserSchema, MessageSchema, ConversationSchema],
    }).then(realm => {
      this.setState({realm: realm, user: realm.objects('User')[0]});
    }).catch(error => {
      console.log(error);
    });
  }

  componentWillUnmount()  {
  }

  getLastMessage(conversation) {

    if (conversation.messages.length===0) return {text: '', date: new Date()};
    return conversation.messages[conversation.messages.length-1];
  }

  refresh() {
    this.setState({});
  }

  render() {

    var conversations=[];
    if (this.state.realm)  {
      var allConversations = this.state.realm.objects('Conversation'), i=0;
      let conversation;
      for (i; i<allConversations.length; i++) {

        conversation = allConversations[i];
        var lastMessage = this.getLastMessage(conversation);

        conversations.push(<Conversation navigation = {this.props.navigation}
                                         realm = {this.state.realm}
                                         refresh = {this.refresh.bind(this)}
                                         key={i}
                                         sender = {conversation.correspondent.name}                                          
                                         message = {lastMessage.text}
                                         date={(lastMessage.date.getDate()+1)+"/"+(lastMessage.date.getMonth()+1)+"/"+lastMessage.date.getFullYear()} 
                                         time={lastMessage.date.getHours()+":"+lastMessage.date.getMinutes()} 
                                         picture={{source: pictures[conversation.correspondent.name]}}></Conversation>);
      }
    }

    return (
      <Container ref="container">
      <Header center={<Title style={[styles.Title]}>MY CONVERSATIONS</Title>} 
              left={<ToolbarButton name='md-settings' 
                                   onPress={() => {this.props.navigation.navigate('Profile', {realm: this.state.realm})}}/>}/>
        <ConversationsWindow ref="cw">
          {conversations}
        </ConversationsWindow>
        <ActionButton onPress={() => {this.props.navigation.navigate('Connection')}}></ActionButton>
      </Container>
   );
  }
}