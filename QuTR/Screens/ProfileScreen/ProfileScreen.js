import React, { Component } from 'react';
import {
  View,
  Keyboard,
  Image,
  Alert,
  TextInput,
  BackAndroid,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import { Container, Title, Text, Picker, Item as FormItem} from 'native-base';
import { Button, Form } from 'react-native-elements'
import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import InputWindow from '../../Components/inputWindow/InputWindow.js';
import Header from '../../Components/header/Header.js';
import ToolbarButton from '../../Components/toolbarButton/ToolbarButton.js';
import ProfileFormItem from '../../Components/profileFormItem/ProfileFormItem.js';
import LogoutButton from '../../Components/logoutButton';

import styles from './styles.js';
import {
  BLACK,
  SECONDARY_DARK,
  SECONDARY_LIGHT
} from '../../masterStyle.js';

const Item=Picker.Item;

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
    var realm = this.props.screenProps.realm;
    var theUser = this.props.screenProps.user; 
    this.state = { realm: realm,
                   user: theUser, 
                   picture: theUser.picture,
                   id: theUser.id, 
                   name: theUser.name, 
                   country: theUser.country, 
                   age: theUser.age, 
                   language: theUser.language, 
                   gender: theUser.gender
    }
    this.updateDatabase = this.updateDatabase.bind(this);
  }

  updateDatabase()  {

    this.state.realm.write(() => {
      this.state.user.picture = this.state.picture;
      this.state.user.name = this.state.name;
      this.state.user.country = this.state.country;
      this.state.user.age = parseInt(this.state.age);
      this.state.user.language = this.state.language;
      this.state.user.gender = this.state.gender;
    });
  
    ToastAndroid.show('The settings have been saved!', ToastAndroid.LONG);
    this.setState({});
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
      <Container ref="container" style = {[styles.Container]}>
        <Header right={<LogoutButton/>}/>
        <InputWindow ref="cw">

          <TouchableOpacity style={[styles.imageContainer]} 
                            onPress = {() => {this.props.navigation.navigate('Gallery', { update: this.updateDatabase, that: this});}}>
              <Image style={[styles.profileImage]} source={{uri: this.state.picture}}/>
          </TouchableOpacity>

           <View style={[styles.form]}>
            <ProfileFormItem label="Name">
              <TextInput underlineColorAndroid='transparent' 
                         placeholder='Enter name:' 
                         onChangeText={(value) => {this.setState({name: value})}} 
                         value={this.state.name}
                         selectionColor={SECONDARY_LIGHT}
                         style={{color: SECONDARY_LIGHT, textAlign: 'center'}}/>
            </ProfileFormItem>
            <ProfileFormItem label="Country">
              <Picker mode='dialog' 
                      onValueChange={(itemValue, itemPosition) => {this.setState({country: itemValue}, function () {})}} 
                      selectedValue={this.state.country}
                      selectionColor={SECONDARY_LIGHT}
                      style={{color: SECONDARY_LIGHT}}>
                {this.listItems(countries)}
              </Picker>
            </ProfileFormItem>
            <ProfileFormItem label="Language">
              <Picker mode='dialog' 
                      onValueChange={(itemValue, itemPosition) => {this.setState({language: itemValue}, function () {})}} 
                      selectedValue={this.state.language}
                      selectionColor={SECONDARY_LIGHT}
                      style={{color: SECONDARY_LIGHT}}>
                {this.listItems(languages)}
              </Picker>
            </ProfileFormItem>
            <ProfileFormItem label="Age">
              <TextInput keyboardType='numeric' 
                         underlineColorAndroid='transparent' 
                         placeholder='Enter your age:' 
                         onChangeText={(value) => {this.setState({age: value})}} 
                         value={this.state.age.toString()}
                         selectionColor={SECONDARY_LIGHT}
                         style={{color: SECONDARY_LIGHT, textAlign: 'center'}}/>
            </ProfileFormItem>
            <ProfileFormItem label="Gender">
              <Picker mode='dialog' 
                      onValueChange={(itemValue, itemPosition) => {this.setState({gender: itemValue}, function () {})}} 
                      selectedValue={this.state.gender}
                      selectionColor={SECONDARY_LIGHT}
                      style={{color: SECONDARY_LIGHT}}>
                {this.listItems(genders)}
              </Picker>    
            </ProfileFormItem> 
          </View>
          <Button iconRight={{name: 'check', size: 25, color: SECONDARY_DARK}} 
                  buttonStyle={[styles.confirm]} 
                  color = {SECONDARY_DARK}
                  title='CONFIRM CHANGES' 
                  onPress={() => {this.updateDatabase(false)}}>
          </Button>
        </InputWindow>
      </Container>
   );
  }
}