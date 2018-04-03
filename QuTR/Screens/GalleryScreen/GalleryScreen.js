import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View,
  Image,
  Alert,
  TouchableOpacity,
  CameraRoll,
  Dimensions,
  ScrollView,
  ToastAndroid,
  ActivityIndicator
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
  SECONDARY_LIGHT
} from '../../masterStyle.js';

import { appFolder } from '../../Screens/InitialScreen/DashboardRedirecter/DashboardRedirecter.js';

const LOADPICTURES = 60;

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Blob = RNFetchBlob.polyfill.Blob;
window.Blob = Blob;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;

export default class GalleryScreen extends Component<{}>  {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);  
    this.state = { photos: [],
                   lastCursor: null,
                   load: true,
                   uid: this.props.navigation.state.params.uid,
                   loadingIndicator: false
    }
  }

  componentWillMount()  {
    this.getPhotos(true);
  }

  goBack()  {
    const backAction = NavigationActions.back({});
    this.props.navigation.dispatch(backAction);
  }

  refreshAndFetch() {

    this.setState({photos: [],
                   lastCursor: null,
                   load: true}, this.fetchPhotos);
  }

  /* Take different actions if we load for the first time or come back from camera */
  getPhotos = (fresh) => {

    if (fresh)  this.refreshAndFetch();
    else {      
      if (this.state.photos.length>=LOADPICTURES) this.fetchPhotos();
      else ToastAndroid.show("No more photos", ToastAndroid.SHORT);
    }
  }

  /* Gets photos from camera roll */
  fetchPhotos() {

    /* Load batch by batch, not all gallery pictures at once */
    if (!this.state.load)  return;

    this.setState({loadingIndicator: true});

    var fetchParams = {
      first: LOADPICTURES,
      assetType: 'Photos',
      after: this.state.lastCursor
    }

    /* Update pictures array */
    CameraRoll.getPhotos(fetchParams)
    .then(r => { this.setState({ photos: this.state.photos.concat(r.edges), 
                                 lastCursor: r.page_info.end_cursor,
                                 load: false,
                                 loadingIndicator: false});
    })
    .catch((err) => {Alert.alert("Error", "Couldn't fetch photos.")})
  }

  updateRemotely()  {
    this.props.navigation.state.params.update();
  }

  setProfilePicture = (image) => {

      this.setState({loadingIndicator: true})
      var path = image.node.image.uri;
      var rnfbURI = RNFetchBlob.wrap(path)
      /* Create Blob from file path */
      Blob
        .build(rnfbURI, { type : 'image/png;'})
        .then((blob) => {
          /* Upload image using Firebase SDK */
          firebaseService.storage()
            .ref('profile-pictures')
            .child(this.state.uid)
            .put(blob, { contentType : 'image/png' })
            .then((snapshot) => {
              blob.close();

              firebaseService.storage()
              .ref('profile-pictures')
              .child(this.state.uid)
              .getDownloadURL()
              .then((url) => {

                this.setState({loadingIndicator: false})
                /* Navigate back to ProfileScreen and update the profile picture automatically */
                this.props.navigation.state.params.that.setState({picture: url}, 
                  () => { this.updateRemotely();
                          this.goBack()
                        }
                );                
              })
              .catch((err) => {
                Alert.alert("Error!")
              })            
            })
            .catch((err) => {
            Alert.alert("Error!")
          })
        })
        .catch((err) => {
          Alert.alert("Error!")
        })
  }

  render() {

    return (
      <Container ref="container" style = {[styles.Container]}>
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
            <Footer left={<ToolbarButton name='ios-more'
                                         onPress={() => {this.setState({load: true}, () => {this.getPhotos(false)});}}/>}
                    right={<ToolbarButton name='md-camera'
                                          onPress={() => {this.props.navigation.navigate('Camera', {refreshAndFetch: this.refreshAndFetch});}}/>}/>
            {this.state.loadingIndicator &&
              <View style={styles.loading}>
                <ActivityIndicator size='small' />
              </View>
            }
      </Container>
   );
  }
}