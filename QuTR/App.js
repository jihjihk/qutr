/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import {
  Alert,
  Platform
} from 'react-native';

import RNFetchBlob from 'react-native-fetch-blob';

import CameraScreen from './Screens/CameraScreen/CameraScreen.js';
import ChatScreen from './Screens/ChatScreen/ChatScreen.js';
import ConversationsScreen from './Screens/ConversationsScreen/ConversationsScreen.js';
import ProfileScreen from './Screens/ProfileScreen/ProfileScreen.js';
import ConnectionScreen from './Screens/ConnectionScreen/ConnectionScreen.js';

import { UserSchema, MessageSchema, ConversationSchema } from './Schemas.js';

const Realm = require('realm');

const SimpleApp = StackNavigator({
  Conversations: { screen: ConversationsScreen },
  Chat: { screen: ChatScreen },    
  Camera: { screen: CameraScreen },
  Profile: { screen: ProfileScreen },
  Connection: { screen: ConnectionScreen}
});

export const appFolder = ((Platform.OS == 'android' ? RNFetchBlob.fs.dirs.PictureDir : RNFetchBlob.fs.dirs.MainBundleDir)+"/QuTR");

export default class App extends Component<{}> {

  constructor(props)  {

    super(props);
  }

  componentWillMount()  {
     this.createAppFolder();
  }

  createAppFolder()  {

    var profilePictures = appFolder+"/Profile Pictures";

    RNFetchBlob.fs.isDir(appFolder)
    .then((isDir) => {

      if (!isDir)  {
        RNFetchBlob.fs.mkdir(appFolder)
          .then(() => {
            RNFetchBlob.fs.mkdir(profilePictures)
            .then(() => {})
            .catch((err) => {})
          })
          .catch((err) => {})
      }        
    })
    .catch((err) => {console.log("Err: ", err)})
  }

  render() {
    return <SimpleApp/>;
  }
}
