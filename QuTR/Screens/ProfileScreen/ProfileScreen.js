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
  TouchableHighlight,
  CameraRoll,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
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
import { appFolder } from '../../App.js';

const Item=Picker.Item;
const Realm = require('realm');
const { width } = Dimensions.get('window');


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
                   picture: theUser.picture,
                   id: theUser.id, 
                   name: theUser.name, 
                   country: theUser.country, 
                   age: theUser.age, 
                   language: theUser.language, 
                   gender: theUser.gender,
                   photos: [],
                   modalVisible: false,
                   lastCursor: null,
                   load: true,
    }
  }

  updateDatabase(fromCameraRoll)  {

    this.state.realm.write(() => {
      this.state.user.picture = this.state.picture;
      this.state.user.name = this.state.name;
      this.state.user.country = this.state.country;
      this.state.user.age = parseInt(this.state.age);
      this.state.user.language = this.state.language;
      this.state.user.gender = this.state.gender;
      //this.state.realm.objects('Conversation')[0].messages = [];
    });
  
    ToastAndroid.show('The settings have been saved!', ToastAndroid.LONG);

    if (!fromCameraRoll) setTimeout(this.goBack.bind(this), 100);    
  }

  goBack()  {
    const backAction = NavigationActions.back({});
    this.props.navigation.dispatch(backAction);
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

  refreshAndFetch() {

    this.setState({photos: [],
                   lastCursor: null,
                   load: true}, this.fetchPhotos);
  }

  getPhotos = (fresh) => {

    if (fresh)  this.refreshAndFetch();
    else this.fetchPhotos();
  }

  fetchPhotos() {

    if (!this.state.load)  return;

    const fetchParams = {
      first: 60,
      assetType: 'Photos'
    }

    if (this.state.lastCursor) fetchParams.after = this.state.lastCursor;

    CameraRoll.getPhotos(fetchParams)
    .then(r => { this.setState({ photos: this.state.photos.concat(r.edges), 
                                 lastCursor: r.page_info.end_cursor,
                                 load: false});
    })
    .catch((err) => {Alert.alert("Error", "Couldn't fetch photos.")})
  }

  toggleModal = () => {

    if (!this.state.modalVisible) 
      this.getPhotos(true);
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  setProfilePicture = (image) => {

      var splitPath = image.node.image.uri.split("/");
      var number = splitPath[splitPath.length-1];
      var profilePictures = appFolder+"/Profile Pictures";
      var newURI = profilePictures + "/" +number;

      /* Check that the App directory exists */
      RNFetchBlob.fs.isDir(profilePictures)
      .then((isDir) => {

        if (!isDir)  {
          Alert.alert("Error", "Can't access app folder");
          this.toggleModal();
        }

        /* Clear the App's picture directory */
        RNFetchBlob.fs.ls(profilePictures)
        .then((files) => {
            for (var i=0; i<files.length; i++)  {
              RNFetchBlob.fs.unlink(profilePictures+"/"+files[i])
              .then(() => {})
              .catch((err) => {})
            }
        })
        .catch((err) => {})

        /* Copy the chosen picture to App picture directory */
        RNFetchBlob.fs.cp(image.node.image.uri, newURI)
          .then(() => { 
            this.setState({picture: "file://"+newURI}, 
              function() { this.toggleModal();
                           this.updateDatabase(true);                           
            });
          })
          .catch((err) => {"Error", "Error copying the picture!"})
       })
      .catch((err) => {console.log("Err: ", err)})

      /* Refresh Gallery */
      RNFetchBlob.fs.scanFile([ { path : newURI } ])
       .then(() => {})
       .catch((err) => {
         console.log("scan file error")
       })
  }

  render() {

    return (
      <Container ref="container" >
        <Header center={<Title style={[styles.Title]}>MY PROFILE</Title>}/>
        <InputWindow ref="cw">

          <TouchableOpacity style={[styles.imageContainer]} 
                            onPress = {() => {this.toggleModal();}}>
              <Image style={[styles.profileImage]} source={{uri: this.state.picture}}/>
          </TouchableOpacity>

          <Modal animationType={"none"}
                 transparent={false}
                 visible={this.state.modalVisible}
                 onRequestClose={() => console.log('closed')}>
            <View style={styles.modalContainer}>
              <Header center={<Title style={[styles.Title]}>CAMERA ROLL</Title>}
                      left={<ToolbarButton name='md-arrow-back' 
                                            onPress={() => {this.toggleModal()}}/>}
                      right={<ToolbarButton name='md-camera' 
                                            onPress={() => {this.props.navigation.navigate('Camera', 
                                                                {path: appFolder, showModal: this.toggleModal});
                                                            setTimeout(this.toggleModal, 300);}}/>}
                      style={{marginBottom: 5}}/>
              <ScrollView
                contentContainerStyle={styles.scrollView}>
                {
                  this.state.photos.map((p, i) => {
                    return (
                      <TouchableOpacity style={{ marginBottom: 5,
                                                 marginRight: 5}}
                                          key={i}
                                          underlayColor='transparent'
                                          onPress={() => {this.setProfilePicture(p)}}>
                        
                        <Image style={{ width: width/4.3,
                                        height: width/4.3}}
                               source={{uri: p.node.image.uri}}/>
                      </TouchableOpacity>)
                  })
                }
              </ScrollView>
              <View style={{marginTop: 5}}>
                <TouchableOpacity style={[styles.loadMore]} 
                                  onPress={() => {this.setState({load: true}, function() {this.getPhotos(false)});}}
                                  activeOpacity={0.75}>
                  <Text style = {{color: 'white', fontSize: 16}}>LOAD MORE</Text>
                </TouchableOpacity>
              </View>
            </View>

          </Modal>

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
                  onPress={() => {this.updateDatabase(false)}}>
          </Button>
        </InputWindow>
      </Container>
   );
  }
}