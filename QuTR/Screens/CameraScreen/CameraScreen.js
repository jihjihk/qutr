import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  BackHandler,
  ToastAndroid,
  Dimensions
} from 'react-native';

import {
  Container,
  Title
} from 'native-base';

import Camera from 'react-native-camera';
import RNFetchBlob from 'react-native-fetch-blob';
import { NavigationActions } from 'react-navigation';

import Header from '../../Components/header/Header.js';
import Footer from '../../Components/footer/Footer.js';
import ToolbarButton from '../../Components/toolbarButton/ToolbarButton.js';

import styles from './styles.js';

export default class CameraScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType : 'back',
      mirrorMode : false
    }
  }

  static navigationOptions = { header: null };

  componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
      return true;
  }

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
    this.props.navigation.state.params.showModal();
  }

  takePicture() {
   this.camera.capture()
     .then((data) => {
         ToastAndroid.show('Saving the picture...', ToastAndroid.SHORT);
         this.goBack();
          })
     .catch(err => console.error(err));
  }

  pressBack() {
    setTimeout(this.goBack.bind(this), 10);
  }

  render() {
    return (
      <Container ref='container'>
        <Header left = {<ToolbarButton name='md-arrow-back'
                                       onPress = {this.pressBack.bind(this)}/>}
                center={<ToolbarButton name='md-reverse-camera' 
                                       onPress={this.changeCameraType.bind(this)}/>}/>
        <Camera
           ref={(cam) => { this.camera = cam; }}
           style={styles.preview}
           aspect={Camera.constants.Aspect.fill}
           captureTarget={Camera.constants.CaptureTarget.cameraRoll}
           type={this.state.cameraType}
           mirrorImage={this.state.mirrorMode}
           >
       </Camera>
       <Footer center={<ToolbarButton name='md-camera' 
                                       onPress={this.takePicture.bind(this)}
                                       style={{ color: 'white', fontSize: 40 }} />} 
               style={{backgroundColor: 'black', height: 60}}/>        
      </Container>
    );
  }
}
