import React, { Component } from 'react';
import {
  	ScrollView,
    KeyboardAvoidingView,
    View,
    Keyboard,
    Image
} from 'react-native';

import Message from './../message/Message.js';

import styles from './styles.js';

export default class ChatWindow extends Component {

  constructor(props) {
    super(props);
    this.state = {message: props.messages,
                  kavStyle: [styles.withoutKeyboard],
                  helperStyle: [styles.noHeight]};
    var that=this;
  }

  receiveMessage = (messages) => {

    this.setState({message: messages}, function() {});    
  }

  scrolltoBottom = () => {

    this.refs.scrollView.scrollToEnd({animated: false});   
  }  

  onKeyboardShow()  {
    this.setState({kavStyle: [styles.withoutKeyboard, 
                              styles.withKeyboard], 
                   helperStyle: [styles.height]});
    this.refs.scrollView.scrollToEnd({animated: false});
  }

  onKeyboardHide()  {
    this.setState({kavStyle: [styles.withoutKeyboard], 
                   helperStyle: [styles.noHeight]});
    this.refs.scrollView.scrollToEnd({animated: false});
  }

  getMessages() {

    var messages=[];
    for (var i=0; i<this.state.message.length; i++) {

      if (this.state.message[i].owner=="me")  {

        messages.push(<View key={i} style={[styles.myMessageView]}>
                        <Message  message={this.state.message[i].text} 
                                  style={[styles.myMessage]}/>
                        <Image source={{uri: this.props.myPicture}} 
                               style={[styles.picture]}/>
                      </View>);
      }
      else if (this.state.message[i].owner=="them") {

        messages.push(<View key={i} style={[styles.theirMessageView]}>
                        <Image source={this.props.picture} 
                               style={[styles.picture]}/>
                        <Message message={this.state.message[i].text} 
                                 style={[styles.theirMessage]}/>
                      </View>);
      }
    }
    return messages;
  }

  render = () => {

    return (
        <KeyboardAvoidingView behavior='padding' 
                              style={this.state.kavStyle} 
                              keyboardVerticalOffset={-240}>
          <ScrollView style={[styles.sw, this.props.style]} 
                      scrollEnabled={true} 
                      ref="scrollView"
                      onContentSizeChange={(width,height) => this.scrolltoBottom()}>
            {this.getMessages()}
            <View style={[this.state.helperStyle]}></View>
          </ScrollView>
        </KeyboardAvoidingView>
    );
  }
}