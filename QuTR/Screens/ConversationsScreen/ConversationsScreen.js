import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Keyboard,
  Alert
} from 'react-native';
import { Container, Title, Text, } from 'native-base';
import { StackNavigator } from 'react-navigation';

import ToolbarButton from '../../Components/toolbarButton/ToolbarButton.js'
import Header from '../../Components/header/Header.js';
import ConversationsWindow from '../../Components/conversationsWindow/ConversationsWindow.js';
import Conversation from '../../Components/conversation/Conversation.js';

import { UserSchema, MessageSchema, ConversationSchema } from '../../Schemas.js';

import styles from './styles.js';
import { PRIMARY_DARK,
         PRIMARY,
       } from '../../masterStyle.js';

const Realm = require('realm');

const pictures = {"MERCHANT": require("../../Pictures/merchant.png"),
                  "COUNTER ATTENDANT": require("../../Pictures/counter.png"),
                  "TAXI DRIVER": require("../../Pictures/driver.jpg")}

var self;

export default class ConversationsScreen extends Component<{}>  {

  constructor(props) {
    super(props);
    this.state= {
      firebase: firebaseService.auth(),
      user: firebaseService.auth().currentUser};
    self = this;
  }

  static navigationOptions = { header: null };

  getLastMessage(conversation) {

    if (conversation.messages.length===0) return {text: '', date: new Date()};
    return conversation.messages[conversation.messages.length-1];
  }

  refresh() {
    self.setState({});
  }

  render() {

    var conversations=[];
    // if (this.state.firebase)  {
    //   var allConversations = this.state.firebase.objects('Conversation'), i=0;
    //   let conversation;
    //   for (i; i<allConversations.length; i++) {

    //     conversation = allConversations[i];
    //     var lastMessage = this.getLastMessage(conversation);

    //     conversations.push(<Conversation navigation = {this.props.navigation}
    //                                      firebase = {this.state.firebase}
    //                                      user = {this.state.user}
    //                                      refresh = {this.refresh.bind(this)}
    //                                      key={i}
    //                                      sender = {conversation.correspondent.name}                                          
    //                                      message = {lastMessage.text}
    //                                      date={(lastMessage.date.getDate()+1)+"/"+(lastMessage.date.getMonth()+1)+"/"+lastMessage.date.getFullYear()} 
    //                                      time={lastMessage.date.getHours()+":"+lastMessage.date.getMinutes()} 
    //                                      picture={{source: pictures[conversation.correspondent.name]}}></Conversation>);
    //   }
    // }

    return (
      <Container ref="container" style={[styles.Container]}>
        <ConversationsWindow ref="cw">
          {(conversations.length==0) && 
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
              <Text>No conversations to display</Text>
            </View>
          }
          {conversations}
        </ConversationsWindow>
      </Container>
   );
  }
}