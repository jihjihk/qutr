import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View,
  Keyboard,
  ActivityIndicator,
  ListView,
  Image,
  Alert
} from 'react-native';
import { Container, Title, Text, } from 'native-base';
import { StackNavigator } from 'react-navigation';

import ToolbarButton from '../../Components/toolbarButton/ToolbarButton.js';
import MessageInput from '../../Components/messageInput/MessageInput.js';
import Message from '../../Components/message/Message.js';
import ChatWindow from '../../Components/chatWindow/ChatWindow.js';
import SuggestionButton from '../../Components/suggestionButton/SuggestionButton.js';
import SuggestionBar from '../../Components/suggestionBar/SuggestionBar.js';
import Header from '../../Components/header/Header.js';
import Footer from '../../Components/footer/Footer.js';

import styles from './styles.js';

import { BLACK, 
         SECONDARY_LIGHT } from '../../masterStyle.js'

const Firebase = require('firebase');
var self;

export default class ChatScreen extends Component<{}>  {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    self=this;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state={sendDisabled: true,
                sendStyle: {color: BLACK},
                user: firebaseService.auth().currentUser,
                myPicture: "",
                loading: true,
                dataSource: ds
              };
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

   _keyboardDidShow () {
    this.refs.cw.onKeyboardShow();
    this.refs.sb.onKeyboardShow();
  }

  _keyboardDidHide () {
    this.refs.cw.onKeyboardHide();
    this.refs.sb.onKeyboardHide();
  }

  componentDidMount() {

    var urref = firebaseService.database().ref()
                .child('users')
                .child(this.state.user.uid)
                .child('userRooms')
                .child(this.props.navigation.state.params.roomID);

    this.setState({urref: urref});

    /* Get a list of all messages for a conversation. Maybe we can limit if the number grows to be too large */
    urref.orderByChild('timestamp').on('value', (e) => {
            var rows = [];
            if ( e && e.val() ) {                
                e.forEach(function(child) 
                  {rows.push ( child )})
            }
            var ds = this.state.dataSource.cloneWithRows(rows);
            this.setState({
                dataSource: ds,
                loading: false
            });
        });
  }

  componentDidUnMount() {
    /* Turn off the listeners */
    firebaseService.database().ref()
      .child('users')
      .child(this.state.user.uid).off('value');

    this.state.urref.off('value')
  }  

  sendMessage = () => {

    if (this.state.sendDisabled)  return;

    /* Read the text input, create a message, update proper database entries and clean up the interface */
    var text="";
    var previousSelections = this.refs.mi.state.previousSelections;
    previousSelections
    .forEach(function(child) 
      {
        text+=child+" ";
      })

    var newMessage = this.createMessage(this.state.user.uid, text);
    var newMessageKey = this.getNewMessageKey();

    this.pushToUserChatrooms(newMessage, this.state.user.uid, newMessageKey);
    this.pushToUserChatrooms(newMessage, this.props.navigation.state.params.correspondentKey, newMessageKey);

    this.refs.mi.clearContent();
    this.refs.sb.clean();
    this.disableSend();    
  }

  getNewMessageKey = () => {
    return firebaseService.database().ref()
      .child('users')
      .child(this.state.user.uid)
      .child('userRooms')
      .child(this.props.navigation.state.params.roomID)
      .push().key;
  }

  pushToUserChatrooms = (message, userID, messageKey) => {

    firebaseService.database().ref()
      .child('users')
      .child(userID)
      .child('userRooms')
      .child(this.props.navigation.state.params.roomID)
      .child(messageKey)
      .set(message);

    /* Update so that this information can be used to show
       a list of conversations in the ConversationsScreen */
    this.updateLatestMessage(message, userID);
  }

  updateLatestMessage = (message, userID) => {

    firebaseService.database().ref()
      .child('users')
      .child(userID)
      .child('userRooms')
      .child(this.props.navigation.state.params.roomID)
      .update({message: message.message, 
               timestamp: message.timestamp, 
               reverseTimestamp: message.reverseTimestamp});
  }

  createMessage = (ownerID, message) => {

    return {
      senderID: ownerID,
      message: message,
      timestamp: Firebase.database.ServerValue.TIMESTAMP,
      reverseTimestamp: 0 - new Date().getTime()
    };
  }  

  enableSend = () => {
    this.setState({sendDisabled: false,
                  sendStyle: {color: SECONDARY_LIGHT}});
  }

  disableSend = () => {

    this.setState({sendDisabled: true,
                  sendStyle: {color: BLACK, 
                              opacity: 1}});
  }

  textChanged = (value, suggestionSelected, remainderString) => {

    var previousSelections = this.refs.mi.state.previousSelections;
    var potentialMessage = this.refs.mi.state.message;
    var stringForSuggestions = value;

    if (suggestionSelected) stringForSuggestions = remainderString;
    else {

      previousSelections
      .forEach(function(child) 
        {
          /* stringForSuggestions is the string which is in the text input
             but hasn't been selected by the user yet.
             This is handling the text that is in the message input 
             before the user has selected a suggestion, 
             not the one returned by Shehroze's function */
          stringForSuggestions = stringForSuggestions.replace(child+" ", ""); 
        })
    }
    
    /* If everything in the message input is identical to our potential message, enable send */
    if (stringForSuggestions.length>0) this.disableSend();
    else this.enableSend();

    this.sendToSuggestionBar(stringForSuggestions);
  }

  /* This is where the current input is being sent to the suggestion bar 
     to generate placeholder suggestions with appended dots */
  sendToSuggestionBar = (value) => {

    this.refs.sb.populate(value);
  }

  selectSuggestion = (value) => {
    this.refs.mi.setText(value);
    /* I first pass the selection to Shehroze, 
       then he gives me back the remainding text, 
       the one that wasn't used to produce the suggestion 
       That text is the third parameter for the function
       E.g. If input is "I want 5" and a suggestion is "I want",
            and the user selects it,
            we pass 5 as the third parameter to the following function */
    this.textChanged(value, true, "");
  }

  renderRow = (rd) => {

    if (rd.val().senderID==this.state.user.uid)  {

      return (<View style={[styles.myMessageView]}>
                <Message message={rd.val().message} 
                         style={[styles.myMessage]}/>
                <Image source={{uri: this.props.navigation.state.params.myPicture}} 
                       style={[styles.picture]}/>
              </View>);
      }

      else if (!!rd.val().senderID) {

        return (<View style={[styles.theirMessageView]}>
                  <Image source={{uri: this.props.navigation.state.params.picture}} 
                         style={[styles.picture]}/>
                  <Message message={rd.val().message} 
                           style={[styles.theirMessage]}/>
                </View>);
    }

    else return null;
  }

  render() {
    return (
      <Container ref="container" style={[styles.Container]}>
        <Header center={<Title style={[styles.Title]}>{this.props.navigation.state.params.name}</Title>}/>
        <ChatWindow ref="cw">

          { this.state.loading ? <View style={{flex: 1, justifyContent:'center'}}>
                                    <ActivityIndicator size="large"/>
                                    <Text style={{textAlign: 'center'}}>Loading</Text>
                                  </View>
                                :
                                <ListView dataSource={this.state.dataSource}
                                          enableEmptySections={true}
                                          renderRow={(rowData) => this.renderRow(rowData)}/>
          }
          
        </ChatWindow>

        <Footer center={<MessageInput ref='mi' 
                                      style={{flex: 1}} 
                                      onChangeText={(value) => this.textChanged(value, false)}>
                        </MessageInput>} 
                right={<ToolbarButton style={this.state.sendStyle} 
                                      name='md-send' 
                                      onPress={() => this.sendMessage()}/>}/>
        <SuggestionBar ref='sb' 
                       select = {(suggestion) => this.selectSuggestion(suggestion)}>    
        </SuggestionBar>
      </Container>
   );
  }
}