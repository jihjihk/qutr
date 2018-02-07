import React, { Component } from 'react';
import {
  View,
  Image,
  Alert,
  TouchableOpacity,
  CameraRoll,
  Dimensions,
  ScrollView,
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import { Container, Text } from 'native-base';
import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Footer from '../../Components/footer/Footer.js';
import ToolbarButton from '../../Components/toolbarButton/ToolbarButton.js';

import styles from './styles.js';
import {
  BLACK,
  SECONDARY_DARK,
  SECONDARY_LIGHT
} from '../../masterStyle.js';

import { appFolder } from '../../App.js';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const fetchParams = {
      first: 60,
      assetType: 'Photos'
    }
var self;

export default class GalleryScreen extends Component<{}>  {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);  
    this.state = { photos: [],
                   lastCursor: null,
                   load: true,
    }
    self = this;
  }

  componentWillMount()  {
    this.getPhotos(true);
  }

  goBack()  {
    const backAction = NavigationActions.back({});
    this.props.navigation.dispatch(backAction);
  }

  refreshAndFetch() {

    self.setState({photos: [],
                   lastCursor: null,
                   load: true}, self.fetchPhotos);
  }

  getPhotos = (fresh) => {

    if (fresh)  this.refreshAndFetch();
    else {      
      if (this.state.photos.length>=fetchParams.first) this.fetchPhotos();
    }
  }

  fetchPhotos() {

    if (!this.state.load)  return;

    if (this.state.lastCursor) fetchParams.after = this.state.lastCursor;

    CameraRoll.getPhotos(fetchParams)
    .then(r => { this.setState({ photos: this.state.photos.concat(r.edges), 
                                 lastCursor: r.page_info.end_cursor,
                                 load: false});
    })
    .catch((err) => {Alert.alert("Error", "Couldn't fetch photos.")})
  }

  updateRemotely()  {
    this.props.navigation.state.params.update();
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
            this.props.navigation.state.params.that.setState({picture: "file://"+newURI}, 
              function() { self.updateRemotely();
                           self.goBack()});                           
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

  refreshGallery()  {

  }

  render() {

    return (
      <Container ref="container" style = {[styles.Container]}>
            <View style={styles.modalContainer}>
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
            </View>
            <Footer left={<ToolbarButton name='ios-more'
                                         onPress={() => {this.setState({load: true}, function() {this.getPhotos(false)});}}/>}
                    right={<ToolbarButton name='md-camera' 
                                          onPress={() => {this.props.navigation.navigate('Camera', {refreshAndFetch: this.refreshAndFetch});}}/>}/>
      </Container>
   );
  }
}