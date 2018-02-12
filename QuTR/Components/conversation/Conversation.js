import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    TouchableHighlight
} from 'react-native';

import Message from './../message/Message.js';
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
          <TouchableHighlight underlayColor={PRIMARY_LIGHT} 
                              style={[styles.TouchableHighlight]}
                              onPress={() => this.props.navigation.navigate('Chat', {user: this.state.user, name: this.props.sender, firebase: this.state.firebase, refresh: this.props.refresh, picture: this.props.picture})}>
            <View style={[styles.convo, this.props.style]}>
               <View style={[styles.pictureWrapper]}>
                  <Image style={[styles.picture]} 
                         source={{uri: this.props.picture}}/>
               </View>
               <View style={{flex:1}}>
                 <View style={styles.rowWrapper}>
                    <Text style={[styles.sender]}>{this.props.sender}</Text>
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
          </TouchableHighlight>
    );
  }
}