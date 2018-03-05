import firebaseService from '../../../services/firebase';
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

import QRScreen from '../../QRScreen/QRScreen.js';
import QRScanner from '../../QRScanner/QRScanner.js';

import ConversationNavigator from '../../../Navigators/ConversationNavigator/conversationNavigator.js';
import ProfileNavigator from '../../../Navigators/ProfileNavigator/profileNavigator.js';

import { UserSchema, MessageSchema, ConversationSchema } from '../../../Schemas.js';

const Realm = require('realm');

import { PRIMARY,
         PRIMARY_DARK,
         SECONDARY,
         SECONDARY_DARK
       } from '../../../masterStyle.js'

export const appFolder = ((Platform.OS == 'android' ? RNFetchBlob.fs.dirs.PictureDir : RNFetchBlob.fs.dirs.MainBundleDir)+"/QuTR");

export default class App extends Component<{}> {

  constructor(props)  {

    super(props);
    this.state={
      page: 0
    }
    this.setState.bind(this);
  }

  componentWillMount () {

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

  changeTab = (page) => {

    this.setState({
      page: page
    });
    alert(page+"");
  }

  render()  {

    return (
      <Tabs locked = {true}
            tabBarUnderlineStyle = {{backgroundColor: SECONDARY_DARK}}
            page={this.state.page}
            onChangeTab={(tab) => this.changeTab(tab.i)}>
        <Tab heading={<TabHeading style={{backgroundColor: PRIMARY}}>
                        <Icon name="qrcode-scan" 
                              type='material-community' 
                              color={SECONDARY_DARK}>
                        </Icon>
                      </TabHeading>}>
          <Tabs initialPage={0} 
                locked = {true}
                tabBarUnderlineStyle = {{backgroundColor: SECONDARY_DARK}}>
            <Tab heading={<TabHeading style={{backgroundColor: PRIMARY_DARK}}>
                            <Icon name="qrcode" 
                                  type='material-community' 
                                  color={SECONDARY_DARK}>
                            </Icon>
                          </TabHeading>}>
              <QRScreen changeTab = {this.changeTab}>
              </QRScreen>
            </Tab>
            <Tab heading={<TabHeading style={{backgroundColor: PRIMARY_DARK}}>
                            <Icon name="md-qr-scanner" 
                                  type='ionicon' 
                                  color={SECONDARY_DARK}>
                            </Icon>
                          </TabHeading>}>
              <QRScanner changeTab = {this.changeTab}>
              </QRScanner>
            </Tab>
          </Tabs>
        </Tab>
        <Tab heading={<TabHeading style={{backgroundColor: PRIMARY}}>
                        <Icon name="md-chatboxes" 
                              type='ionicon' 
                              color={SECONDARY_DARK}>
                        </Icon>
                      </TabHeading>}>
          <ConversationNavigator>
          </ConversationNavigator>
        </Tab>
        <Tab heading={<TabHeading style={{backgroundColor: PRIMARY, marginLeft: -1}}>
                        <Icon name="md-settings" 
                              type='ionicon' 
                              color={SECONDARY_DARK}>
                        </Icon>
                      </TabHeading>}>
          <ProfileNavigator>
          </ProfileNavigator>
        </Tab>
      </Tabs>
    );
  }
}
