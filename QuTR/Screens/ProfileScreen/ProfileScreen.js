import React, { Component } from 'react';
import {
  View,
  Keyboard,
  Image,
  TextInput,
  Picker, 
} from 'react-native';
import { Container, Title, Text } from 'native-base';
import { StackNavigator } from 'react-navigation';

import ChatWindow from '../../Components/chatWindow/ChatWindow.js';
import Header from '../../Components/header/Header.js';
import ToolbarButton from '../../Components/toolbarButton/ToolbarButton.js';

import styles from './styles.js';

export default class ProfileScreen extends Component<{}>  {

  static navigationOptions = ({ navigation }) => ({
    header: (
        <Header center={<Title style={[styles.Title]}>MY PROFILE</Title>}/>
        ),
  });

  constructor(props) {
    super(props);
  }

  componentWillMount () {
  }

  componentWillUnmount () {
  }

  _keyboardDidShow () {
  }

  _keyboardDidHide () {
  }

  render() {
    return (
      <Container ref="container">
        <ChatWindow ref="cw">
          <View style={[styles.imageContainer]}>
            <View style={[styles.imageWrapper]}>
              <Image style={[styles.profileImage]} source={require("../../Pictures/user.png")}/>
            </View>
          </View>
          <View style={[styles.form]}>
            <View style = {[styles.formRow]}>
              <View style={[styles.formItem]}>
                <Text style={[styles.formLabel]}>Name: </Text><TextInput underlineColorAndroid='transparent' placeholder='Enter name:' style={[styles.formTextInput]}/>
              </View>
            </View>
            <View style = {[styles.formRow]}>
              <View style={[styles.formItem]}>
                <Text style={[styles.formLabel]}>Country: </Text>
                <View style={[styles.formTextInput]}>
                  <Picker>
                    <Picker.Item label="China" value='china'/>
                    <Picker.Item label="UAE" value='uae'/>
                    <Picker.Item label="United States of America" value='usa'/>
                  </Picker>
                </View>
              </View>
            </View>
            <View style = {[styles.formRow]}>
              <View style={[styles.formItem]}>
                <Text style={[styles.formLabel]}>Language: </Text>
                <View style={[styles.formTextInput]}>
                  <Picker>
                    <Picker.Item label="Chinese" value='chinese'/>
                    <Picker.Item label="Arabic" value='arabic'/>
                    <Picker.Item label="English" value='english'/>
                  </Picker>
                </View>
              </View>
            </View>
            <ToolbarButton name='md-thumbs-up' style={{color: 'green'}}/>
          </View>
        </ChatWindow>
      </Container>
   );
  }
}