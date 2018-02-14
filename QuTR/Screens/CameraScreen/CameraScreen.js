import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  ToastAndroid,
  Dimensions,
  View
} from 'react-native';

import {
  Container,
  Title,
  Button
} from 'native-base';

import Camera from 'react-native-camera';
import RNFetchBlob from 'react-native-fetch-blob';
import { NavigationActions } from 'react-navigation';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

import Header from '../../Components/header/Header.js';
import Footer from '../../Components/footer/Footer.js';
import ToolbarButton from '../../Components/toolbarButton/ToolbarButton.js';

import styles from './styles.js';
import {
  SECONDARY_LIGHT,
  PRIMARY,
  PRIMARY_DARK,
  SECONDARY_DARK
} from '../../masterStyle.js';

export default class CameraScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType : 'back',
      mirrorMode : false
    }
  }

  static navigationOptions = { header: null };

  changeCameraType() {
    if(this.state.cameraType === 'back') {
      this.setState({
        cameraType : 'front',
        mirrorMode : true
      })
    }
    else {
      this.setState({
        cameraType : 'back',
        mirrorMode : false
      })
    }
  }

  goBack()  {
    const backAction = NavigationActions.back({});
    this.props.navigation.dispatch(backAction);
  }

  takePicture() {
   this.camera.capture()
     .then((data) => {
         ToastAndroid.show('Saving the picture...', ToastAndroid.SHORT);
         this.props.navigation.state.params.refreshAndFetch();
         this.goBack();
          })
     .catch(err => console.error(err));
  }

  render() {
    return (
      <Container ref='container'>                      
        <Camera
           ref={(cam) => { this.camera = cam; }}
           style={styles.preview}
           aspect={Camera.constants.Aspect.fill}
           captureTarget={Camera.constants.CaptureTarget.cameraRoll}
           type={this.state.cameraType}
           mirrorImage={this.state.mirrorMode}
           >
       </Camera>
       <ActionButton  buttonColor = {PRIMARY_DARK} 
                      position = "center"
                      offsetX={0}
                      buttonTextStyle={{color: SECONDARY_DARK}}
                      nativeFeedbackRippleColor = {PRIMARY}
                      fixNativeFeedbackRadius = {true}
                      autoInactive = {false}>            
          <ActionButton.Item onPress={this.takePicture.bind(this)}
                             useNativeFeedback={false}>
            <Icon name='md-camera'
                  style={{fontSize: 30, color: SECONDARY_LIGHT}}/>
          </ActionButton.Item>
          <ActionButton.Item onPress={this.changeCameraType.bind(this)}
                             useNativeFeedback={false}>
            <Icon name='md-reverse-camera'
                  style={{fontSize: 30, color: SECONDARY_LIGHT}}/>
          </ActionButton.Item>
      </ActionButton>
      </Container>
    );
  }
}
