import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';

import ToolbarButton from './../toolbarButton/ToolbarButton.js';

import {
  PRIMARY_LIGHT
} from '../../masterStyle.js';

import styles from './styles.js';

export default class Conversation extends Component {

  constructor(props) {
    super(props);
    this.state={
      firebase: firebaseService.auth(),
      user: firebaseService.auth().currentUser
    }
  }

  render = () => {

    return (
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat', {roomID: this.props.roomID, 
                                                                                   name: this.props.correspondent, 
                                                                                   correspondentKey: this.props.correspondentKey, 
                                                                                   picture: this.props.theirPicture,
                                                                                   myPicture: this.props.myPicture})}>
            <View style={[styles.convo, this.props.style]}>
               <View style={[styles.pictureWrapper]}>
                  <Image style={[styles.picture]} 
                         source={{uri: this.props.theirPicture}}/>
               </View>
               <View style={{flex:1}}>
                 <View style={styles.rowWrapper}>
                    <Text style={[styles.correspondent]}>{this.props.correspondent}</Text>
                    <Text style={[styles.date]}>{this.props.date}</Text>
                 </View>
                 <View style={[styles.rowWrapper]}>
                    <Text numberOfLines={1} 
                          style={styles.lastMessage}>{this.props.message}
                    </Text>
                    <Text style={[styles.time]}>{this.props.time}</Text>
                 </View>
               </View>
            </View>
          </TouchableOpacity>
    );
  }
}