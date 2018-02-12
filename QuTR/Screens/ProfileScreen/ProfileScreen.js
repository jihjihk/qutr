import firebaseService from '../../services/firebase';
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
import { Container, Title, Text} from 'native-base';
import { Button, Form } from 'react-native-elements'
import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import { SegmentedControls } from 'react-native-radio-buttons'

import InputWindow from '../../Components/inputWindow/InputWindow.js';
import Header from '../../Components/header/Header.js';
import ToolbarButton from '../../Components/toolbarButton/ToolbarButton.js';
import ProfileFormItem from '../../Components/profileFormItem/ProfileFormItem.js';
import LogoutButton from '../../Components/logoutButton';

import Lists from "../../Lists.js";

import styles from './styles.js';
import {
  PRIMARY_DARK
} from '../../masterStyle.js';

export default class ProfileScreen extends Component<{}>  {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);  
    var firebase = firebaseService;
    var theUser = firebase.auth().currentUser; 
    this.state = { firebase: firebase,
                   user: theUser, 
                   picture: "https://www.jamf.com/jamf-nation/img/default-avatars/generic-user.png",
                   name: "", 
                   age: "", 
                   language: "", 
                   gender: ""
    }
    this.updateDatabase = this.updateDatabase.bind(this);

    this.handleNameChange = (name) => {
      this.setState({name: name});
    };

    this.handleAgeChange = (age) => {
      this.setState({age: age});
    };

    this.setSelectedLanguage = (selectedOption) => {
      this.setState({language:selectedOption});
    }

    this.setSelectedGender = (selectedOption) => {
      this.setState({gender:selectedOption});
    }

  }

  componentWillMount()  {
    self=this;
    var picture;
    this.state.firebase.database()
      .ref('/users/' + this.state.user.uid)
      .once('value')
      .then(function(snapshot) {  

        /* Check if the user hasn't erased the picture from the app folder */
        if (snapshot.val().picture != "" 
          && snapshot.val().picture!=self.state.picture) {

          picture = self.state.picture;
          RNFetchBlob.fs.exists(snapshot.val().picture)
            .then((exist) => {
              if (exist) picture = snapshot.val().picture;
              self.setState({picture: picture})
            }).catch(err => console.error(err));
        }

        self.setState({
          name: snapshot.val().name,
          age: snapshot.val().age,
          language: snapshot.val().language,
          gender: snapshot.val().gender
        });
      })
      .catch(error => {
        dispatch(sessionError(error.message));
      });
  }

  updateDatabase()  {

    this.state.firebase.database()
          .ref('users/'+this.state.user.uid)
          .set({"name": this.state.name,
                "age": this.state.age,
                "language": this.state.language,
                "gender": this.state.gender,
                "picture": this.state.picture
          });
  
    ToastAndroid.show('The settings have been saved!', ToastAndroid.LONG);
    this.setState({});
  }

  render() {

    return (
      <Container ref="container" style = {[styles.Container]}>
        <Header right={<LogoutButton/>}/>
        <InputWindow
        contentContainerStyle={styles.Container}>

          <TouchableOpacity style={[styles.imageContainer]} 
                          onPress = {() => {this.props.navigation.navigate('Gallery', { update: this.updateDatabase, that: this});}}>
              <Image style={[styles.profileImage]} source={{uri: this.state.picture}}/>
          </TouchableOpacity>

          <TextInput
          style={ styles.textInput }
          placeholder="Name"
          returnKeyType='next'
          autoCapitalize='none'
          onChangeText={this.handleNameChange}
          value={this.state.name}
          underlineColorAndroid={'transparent'} />

          <TextInput
          style={ styles.textInput }
          placeholder="Age"
          returnKeyType='done'
          keyboardType='numeric'
          autoCapitalize='none'
          onChangeText={this.handleAgeChange}
          value={this.state.age}
          underlineColorAndroid={'transparent'} />

          <SegmentedControls
            options={ Lists.languages }
            tint={PRIMARY_DARK}
            onSelection={ this.setSelectedLanguage.bind(this) }
            selectedOption={ this.state.language }
            containerStyle={ styles.textInput }/>

          <SegmentedControls
            options={ Lists.genders }
            tint={PRIMARY_DARK}
            onSelection={ this.setSelectedGender.bind(this) }
            selectedOption={ this.state.gender }
            containerStyle={ styles.textInput }/>

          <TouchableOpacity
            style={styles.button}
            onPress={this.updateDatabase}>
            <Text style={styles.buttonTitle}>Confirm changes</Text>
          </TouchableOpacity>

        </InputWindow>
      </Container>
   );
  }
}