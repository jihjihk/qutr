import React, { Component } from 'react';
import {
  Views,
  View,
  ScrollView,
  Keyboard,
  BackHandler,
  Alert
} from 'react-native';
import { Container, Title, Text, } from 'native-base';
import { StackNavigator } from 'react-navigation';

import ToolbarButton from '../../Components/toolbarButton/ToolbarButton.js';
import MessageInput from '../../Components/messageInput/MessageInput.js';
import ChatWindow from '../../Components/chatWindow/ChatWindow.js';
import SuggestionButton from '../../Components/suggestionButton/SuggestionButton.js';
import SuggestionBar from '../../Components/suggestionBar/SuggestionBar.js';
import Header from '../../Components/header/Header.js';
import Footer from '../../Components/footer/Footer.js';

import styles from './styles.js';

import { BLACK, 
         SECONDARY_LIGHT } from '../../masterStyle.js'

export default class ChatScreen extends Component<{}>  {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state={sendDisabled: true,
                sendStyle: {color: BLACK},
                realm: this.props.navigation.state.params.realm,
                conversation: null,
                user: this.props.navigation.state.params.realm.objects('User')[0]
              };
  }

  sendMessage = () => {

    if (this.state.sendDisabled)  return;
    var message = this.refs.mi.state.message;
    this.state.realm.write(() => {

      var myMessage = this.createMessage('me', message);
      var theirMessage = this.createMessage('them', message+" to you too!");
      this.state.conversation.messages.push(myMessage);
      this.state.conversation.messages.push(theirMessage);
    });
    this.refs.cw.receiveMessage(this.getLastMessages(15));
    this.refs.mi.clearContent();
    this.refs.sb.clean();
    this.disableSend();    
  }

  createMessage(owner, message) {

    var theMessage = this.state.realm.create('Message', {

        owner: owner,
        date: new Date(),
        text: message
      });
    return theMessage;
  }  

  getLastMessages(number)   {

    var length = this.state.conversation.messages.length;
    var messages = this.state.conversation.messages;
    if (length<number) return messages;
    return messages.slice(length-number, length);
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

  textChanged = (value) => {

    var message = this.refs.mi.state.message;
    this.refs.mi.setState({message: value});
    this.sendToSuggestionBar(value);
  }

  sendToSuggestionBar = (value) => {

    this.refs.sb.populate(value);
  }

  selectSuggestion = (value) => {
    this.refs.mi.setText(value);
    this.textChanged(value);
    this.enableSend();
  }

  backHandler() {
    this.props.navigation.state.params.refresh();
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    BackHandler.addEventListener('hardwareBackPress', this.backHandler.bind(this));
  }

  componentDidMount() {
    setTimeout(this.renderPropsIntoState.bind(this), 10);
  }

  renderPropsIntoState()  {
    this.setState({conversation: this.state.realm.objects('Conversation')
                                  .filtered('correspondent.name = "'+this.props.navigation.state.params.name+'"')[0]});
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler.bind(this));
  }

  _keyboardDidShow () {
    this.refs.cw.onKeyboardShow();
    this.refs.sb.onKeyboardShow();
  }

  _keyboardDidHide () {
    this.refs.cw.onKeyboardHide();
    this.refs.sb.onKeyboardHide();
  }

  render() {
    if (this.state.conversation==null) return null;
    return (
      <Container ref="container" style={[styles.Container]}>
        <Header center={<Title style={[styles.Title]}>{this.props.navigation.state.params.name}</Title>}/>
        <ChatWindow ref="cw" messages = {this.getLastMessages(15)} picture = {this.props.navigation.state.params.picture} myPicture ={this.state.user.picture}>
        </ChatWindow>

        <Footer center={<MessageInput ref='mi' 
                                      style={{flex: 1}} 
                                      onChangeText={(value) => this.textChanged(value)}/>} 
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