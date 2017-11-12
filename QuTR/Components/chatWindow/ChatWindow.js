import React, { Component } from 'react';
import {
  	ScrollView,
    KeyboardAvoidingView,
    View,
    Keyboard
} from 'react-native';

import Message from './../message/Message.js';

import styles from './styles.js';

export default class ChatWindow extends Component {

  constructor(props) {
    super(props);
    this.state = {message: [],
                  kavStyle: [styles.withoutKeyboard],
                  helperStyle: [styles.noHeight]};
    var that=this;
  }

  receiveMessage = (type, message) => {

    this.setState({message: this.state.message.concat([{type: type, text: message}])});
  }

  scrolltoBottom = () => {

    this.refs.scrollView.scrollToEnd({animated: false});   
  }  

  onKeyboardShow()  {
    this.setState({kavStyle: [styles.withoutKeyboard, styles.withKeyboard], helperStyle: [styles.height]});
    this.refs.scrollView.scrollToEnd({animated: false});
  }

  onKeyboardHide()  {
    this.setState({kavStyle: [styles.withoutKeyboard], helperStyle: [styles.noHeight]});
    this.refs.scrollView.scrollToEnd({animated: false});
  }

  render = () => {

  	var messages=[];

  	for (var i=0; i<this.state.message.length; i++)	{

  		if (this.state.message[i].type=="mm")	messages.push(<Message key={i} message={this.state.message[i].text} style={[styles.myMessage]}/>);
  		else if (this.state.message[i].type=="tm") messages.push(<Message key={i} message={this.state.message[i].text} style={[styles.theirMessage]}/>);
  	}

    return (
        <KeyboardAvoidingView behavior='padding' style={this.state.kavStyle} keyboardVerticalOffset={-240}>
          <ScrollView style={[styles.sw]} scrollEnabled={true} ref="scrollView"
               onContentSizeChange={(width,height) => this.scrolltoBottom()}>
               {this.props.children}
               {messages}
               <View style={[this.state.helperStyle]}></View>
          </ScrollView>
        </KeyboardAvoidingView>
    );
  }
}