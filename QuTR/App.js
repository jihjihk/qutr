/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import {
  Alert,
  Platform,
  View
} from 'react-native';

import { 
  Button,
  Header,
  Tab,
  TabHeading,
  Tabs,
  Text
} from 'native-base';

import { Icon } from 'react-native-elements'

import RNFetchBlob from 'react-native-fetch-blob';

import CameraScreen from './Screens/CameraScreen/CameraScreen.js';
import ChatScreen from './Screens/ChatScreen/ChatScreen.js';
import ConversationsScreen from './Screens/ConversationsScreen/ConversationsScreen.js';
import ProfileScreen from './Screens/ProfileScreen/ProfileScreen.js';
import ConnectionScreen from './Screens/ConnectionScreen/ConnectionScreen.js';
import QRScreen from './Screens/QRScreen/QRScreen.js';
import QRScanner from './Screens/QRScanner/QRScanner.js';

import ConversationNavigator from './Navigators/ConversationNavigator/conversationNavigator.js';
import ProfileNavigator from './Navigators/ProfileNavigator/profileNavigator.js';

import { UserSchema, MessageSchema, ConversationSchema } from './Schemas.js';

const Realm = require('realm');

import { PRIMARY,
         PRIMARY_DARK,
         SECONDARY,
         SECONDARY_DARK } from './masterStyle.js'

export const appFolder = ((Platform.OS == 'android' ? RNFetchBlob.fs.dirs.PictureDir : RNFetchBlob.fs.dirs.MainBundleDir)+"/QuTR");

export default class App extends Component<{}> {

  constructor(props)  {

    super(props);
    this.state={
      realm: null,
      user: null
    };
  }

  componentWillMount () {

    this.createAppFolder();

    Realm.open({
      schema: [UserSchema, MessageSchema, ConversationSchema],
    }).then(realm => {
      this.setState({realm: realm, user: realm.objects('User')[0]});
    }).catch(error => {
      console.log(error);
    });
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

  render()  {

    return (
      <Tabs initialPage={0}
            locked = {true}
            tabBarUnderlineStyle = {{backgroundColor: SECONDARY}}>
        <Tab heading={<TabHeading style={{backgroundColor: PRIMARY}}><Icon name="qrcode-scan" type='material-community' color={SECONDARY}></Icon></TabHeading>}>
          <Tabs initialPage={0} locked = {true}>
            <Tab heading={<TabHeading style={{backgroundColor: PRIMARY_DARK}}><Icon name="md-qr-scanner" type='ionicon' color={SECONDARY_DARK}></Icon></TabHeading>}>
              <QRScanner>
              </QRScanner>
            </Tab>
            <Tab heading={<TabHeading style={{backgroundColor: PRIMARY_DARK}}><Icon name="qrcode" type='material-community' color={SECONDARY_DARK}></Icon></TabHeading>}>
              <QRScreen>
              </QRScreen>
            </Tab>
          </Tabs>
        </Tab>
        <Tab heading={<TabHeading style={{backgroundColor: PRIMARY}}><Icon name="md-chatboxes" type='ionicon' color={SECONDARY}></Icon></TabHeading>}>
          <ConversationNavigator screenProps={{realm: this.state.realm, user: this.state.user}}>
          </ConversationNavigator>
        </Tab>
        <Tab heading={<TabHeading style={{backgroundColor: PRIMARY}}><Icon name="md-settings" type='ionicon' color={SECONDARY}></Icon></TabHeading>}>
          <ProfileNavigator screenProps={{realm: this.state.realm, user: this.state.user}}>
          </ProfileNavigator>
        </Tab>
      </Tabs>
    );
  }
}
