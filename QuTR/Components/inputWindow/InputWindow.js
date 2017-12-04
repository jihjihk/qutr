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
    this.state = {kavStyle: [styles.withoutKeyboard],
                  helperStyle: [styles.noHeight]};
    var that=this;
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

  render = () => {

    return (
        <KeyboardAvoidingView behavior='padding' 
                              style={this.state.kavStyle} 
                              keyboardVerticalOffset={-240}>
          <ScrollView style={[styles.sw]} 
                      scrollEnabled={true} 
                      ref="scrollView"
                      onContentSizeChange={(width,height) => this.scrolltoBottom()}>
            {this.props.children}
            <View style={[this.state.helperStyle]}></View>
          </ScrollView>
        </KeyboardAvoidingView>
    );
  }
}