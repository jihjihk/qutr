import React, { Component } from 'react';

import { Alert } from 'react-native';

import { StackNavigator } from 'react-navigation';

import ProfileScreen from '../../Screens/ProfileScreen/ProfileScreen.js';
import CameraScreen from '../../Screens/CameraScreen/CameraScreen.js';
import GalleryScreen from '../../Screens/GalleryScreen/GalleryScreen.js';

const SimpleApp = StackNavigator({
  Profile: { screen: ProfileScreen },
  Camera: { screen: CameraScreen },
  Gallery: { screen: GalleryScreen }
});

export default class ProfileNavigator extends Component<{}> {

  constructor(props)  {

    super(props);
  }

  render() {
    return (<SimpleApp screenProps={this.props.screenProps}/>);
  }
}