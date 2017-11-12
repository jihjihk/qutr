import React, { Component } from 'react';
import {
  Views,
  View,
  ScrollView,
  Keyboard,
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

import { TBBUTTON, ENABLEDSEND } from '../../masterStyle.js'

export default class ChatScreen extends Component<{}>  {

  static navigationOptions = ({ navigation }) => ({
    header: (
        <Header center={<Title style={[styles.Title]}>{navigation.state.params.name}</Title>} left={<ToolbarButton name='md-settings' onPress={() => that.props.navigation.navigate('Profile')}/>} right={<ToolbarButton name='md-bluetooth'/>}/>
        ),
  });

  constructor(props) {
    super(props);
    this.state={sendDisabled: true,
                sendStyle: {color: TBBUTTON}};
    var that=this;
  }

  sendMessage = () => {

    if (that.state.sendDisabled)  return;
    var message = this.refs.mi.state.message;
    this.refs.cw.receiveMessage("mm", message);
    this.refs.mi.clearContent();
    this.refs.sb.clean();
    this.disableSend();
    
  }

  enableSend = () => {
    this.setState({sendDisabled: false,
                  sendStyle: {color: ENABLEDSEND}});
  }

  disableSend = () => {

    this.setState({sendDisabled: true,
                  sendStyle: {color: TBBUTTON, opacity: 1}});
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

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    that = this;
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow () {
    that.refs.cw.onKeyboardShow();
    that.refs.sb.onKeyboardShow();
  }

  _keyboardDidHide () {
    that.refs.cw.onKeyboardHide();
    that.refs.sb.onKeyboardHide();
  }

  render() {
    return (
      <Container ref="container">
        <ChatWindow ref="cw">
        </ChatWindow>

        <Footer center={<MessageInput ref='mi' style={{flex: 1}} onChangeText={(value) => this.textChanged(value)}/>} 
                right={<ToolbarButton style={this.state.sendStyle} name='md-send' onPress={() => this.sendMessage()}/>}/>
        <SuggestionBar ref='sb' onChildPressed={(input) => this.selectSuggestion(input)}>    
        </SuggestionBar>
      </Container>
   );
  }
}