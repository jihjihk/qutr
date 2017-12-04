import React, { Component } from 'react';
import {
  View,
  Keyboard,
  Image,
  TextInput,
  ToastAndroid,
} from 'react-native';
import { Container, Title, Text, Picker, Item as FormItem} from 'native-base';
import { Button, Form } from 'react-native-elements'
import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import { UserSchema, MessageSchema, ConversationSchema } from '../../Schemas.js';

import InputWindow from '../../Components/inputWindow/InputWindow.js';
import Header from '../../Components/header/Header.js';
import ToolbarButton from '../../Components/toolbarButton/ToolbarButton.js';
import ProfileFormItem from '../../Components/profileFormItem/ProfileFormItem.js';

import styles from './styles.js';

const Item=Picker.Item;
const Realm = require('realm');

var countries = [{label: "China", value: 'china'}, 
                 {label: "United States of America", value: 'usa'}, 
                 {label: "United Arab Emirates", value: 'uae'}];

var languages = [{label: "Chinese", value: 'chinese'}, 
                 {label: "English", value: 'english'}, 
                 {label: "Arabic", value: 'arabic'}];

var genders = [{label: "Male", value: 'male'}, 
               {label: "Female", value: 'female'}, 
               {label: "Other", value: 'other'}];

export default class ProfileScreen extends Component<{}>  {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);  
    var realm = props.navigation.state.params.realm;
    var theUser = realm.objects('User')[0]; 
    this.state = { realm: realm,
                   user: theUser, 
                   id: theUser.id, 
                   name: theUser.name, 
                   country: theUser.country, 
                   age: theUser.age, 
                   language: theUser.language, 
                   gender: theUser.gender
    }
  }

  updateDatabase()  {

    this.state.realm.write(() => {
      this.state.user.name = this.state.name;
      this.state.user.country = this.state.country;
      this.state.user.age = parseInt(this.state.age);
      this.state.user.language = this.state.language;
      this.state.user.gender = this.state.gender;
    });
  
    ToastAndroid.show('The settings have been saved!', ToastAndroid.SHORT);

    setTimeout(this.goBack.bind(this), 100);    
  }

  goBack()  {
    const backAction = NavigationActions.back({});
    this.props.navigation.dispatch(backAction);
  }

  componentWillMount () {  
  }

  componentWillUnmount () {
  }

  _keyboardDidShow () {
  }

  _keyboardDidHide () {
  }

  listItems (items) {

    var pickerItems = [], i=0;
    for (i; i<items.length; i++) {
      pickerItems.push(<Item key={i} label={items[i].label} value={items[i].value}/>);
    }
    return pickerItems;
  }

  render() {
    return (
      <Container ref="container" >
        <Header center={<Title style={[styles.Title]}>MY PROFILE</Title>}/>
        <InputWindow ref="cw">
          <View style={[styles.imageContainer]}>
            <View style={[styles.imageWrapper]}>
              <Image style={[styles.profileImage]} source={require("../../Pictures/user.png")}/>
            </View>
          </View>
          <View style={[styles.form]}>
            <ProfileFormItem label="Name">
              <TextInput underlineColorAndroid='transparent' 
                         placeholder='Enter name:' 
                         onChangeText={(value) => {this.setState({name: value})}} 
                         value={this.state.name}/>
            </ProfileFormItem>
            <ProfileFormItem label="Country">
              <Picker mode='dialog' 
                      onValueChange={(itemValue, itemPosition) => {this.setState({country: itemValue}, function () {})}} 
                      selectedValue={this.state.country}>
                {this.listItems(countries)}
              </Picker>
            </ProfileFormItem>
            <ProfileFormItem label="Language">
              <Picker mode='dialog' 
                      onValueChange={(itemValue, itemPosition) => {this.setState({language: itemValue}, function () {})}} 
                      selectedValue={this.state.language}>
                {this.listItems(languages)}
              </Picker>
            </ProfileFormItem>
            <ProfileFormItem label="Age">
              <TextInput keyboardType='numeric' 
                         underlineColorAndroid='transparent' 
                         placeholder='Enter your age:' 
                         onChangeText={(value) => {this.setState({age: value})}} 
                         value={this.state.age.toString()}/>
            </ProfileFormItem>
            <ProfileFormItem label="Gender">
              <Picker mode='dialog' 
                      onValueChange={(itemValue, itemPosition) => {this.setState({gender: itemValue}, function () {})}} 
                      selectedValue={this.state.gender}>
                {this.listItems(genders)}
              </Picker>    
            </ProfileFormItem> 
          </View>
          <Button iconRight={{name: 'check', size: 25}} 
                  buttonStyle={{backgroundColor: 'black'}} 
                  containerViewStyle={{alignSelf: 'center'}} 
                  title='CONFIRM CHANGES' 
                  onPress={() => {this.updateDatabase()}}>
          </Button>
        </InputWindow>
      </Container>
   );
  }
}