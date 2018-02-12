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

var self;

export default class ConversationsScreen extends Component<{}>  {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state= {
      firebase: firebaseService,
      user: firebaseService.auth().currentUser,
      conversations: []
    };
    self = this;

    this.conversationAddedListener();
  }

  conversationAddedListener = () => {

    this.state.firebase.database().ref()
      .child('users')
      .child(this.state.firebase.auth().currentUser.uid)
      .child('userRooms')
      .on("child_added", 
        function(snapshot, prevChildKey) {
          self.addConversation(snapshot);
        });
  }

  addConversation = (snapshot) => {

    var key=snapshot.key;
    this.state.firebase.database().ref()
      .child('users')
      .child(snapshot.val().correspondent)
      .once('value')
      .then(function(snapshot) {
        var name = snapshot.val().name;
        var convos = self.state.conversations;
        convos.push(
           <Conversation navigation = {self.props.navigation}
                         firebase = {self.state.firebase}
                         user = {self.state.user}
                         refresh = {self.refresh.bind(this)}
                         key={key}
                         sender = {name.toString()}                                          
                         message =  ""
                         date="" 
                         time="" 
                         picture={"https://www.jamf.com/jamf-nation/img/default-avatars/generic-user.png"}>
           </Conversation>)
        self.setState({conversations: convos});
      });
  }

  getLastMessage(conversation) {

    if (conversation.messages.length===0) return {text: '', date: new Date()};
    return conversation.messages[conversation.messages.length-1];
  }

  refresh() {
    self.setState({});
  }

  render() {

    return (
      <Container ref="container" style={[styles.Container]}>
        <ConversationsWindow ref="cw">
          {this.state.conversations.length==0 && <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                                          <Text>No conversations to display</Text>
                                        </View>
          }{this.state.conversations}
        </ConversationsWindow>
      </Container>
   );
  }
}