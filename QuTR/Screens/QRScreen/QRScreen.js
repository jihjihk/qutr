import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View
} from 'react-native';

import styles from './styles.js';

import { PRIMARY_LIGHT } from '../../masterStyle.js'

import QRCode from 'react-native-qrcode-svg';

var self;

export default class QRScreen extends Component<{}>  {

  constructor(props) {
    super(props);
    this.state = {
        text: "http://google.com/"+firebaseService.auth().currentUser.uid.toString(),
        logo: {uri: "https://firebasestorage.googleapis.com/v0/b/qutr-8cc2c.appspot.com/o/logo.png?alt=media&token=d9844d2c-51b4-43a2-a607-a4a7c1f2c5a6"},
        user: firebaseService.auth().currentUser
    };
    self = this;
  }

  componentWillMount = () => {

    this.checkRecentConversation();
  }

  componentDidMount() {
  }

  componentWillUnMount = () => {

    firebaseService.database().ref()
    .child('users')
    .child(this.state.user.uid)
    .off('value');

    this.state.conversationRef.off('value');
  }

  checkRecentConversation = () => {

    firebaseService.database().ref()
    .child('users')
    .child(this.state.user.uid)
    .on('value', function(snapshot) {
      var conversation = snapshot.val().conversation;
      if (!!conversation) {

        var conversationRef = firebaseService.database().ref()
                              .child('conversations')
                              .child(conversation);

        self.setState({conversationRef: conversationRef}, function() {

          conversationRef
          .once('value')
          .then(function(snapshot)  {

            var time = new Date();
            var ms = time.getTime();
            var ID1 = snapshot.val().ID1, ID2 = snapshot.val().ID2;

            conversationRef.update({[ID1]: false, [ID2]: false})

            /* The conversation expired, needs to be removed */
            if (Math.abs(snapshot.val().timestamp - ms) > 86400000) {

              /* Delete database reference of the conversation for each correspondent */
              self.deleteConversationForUser(ID1);
              self.deleteConversationForUser(ID2);
              /* Delete conversation from the database */
              self.state.conversationRef.remove();
            }

            /* This indicatess a new conversation, so just change the tab. 
               If the user had another conversation, that one gets deleted in QR Scanner code */
            else if (Math.abs(snapshot.val().timestamp - ms) < 10000) {
              self.props.changeTab(1);             
            }              
          })
        });
      }
    })
  }

  deleteConversationForUser = (id) => {

    firebaseService.database().ref()
    .child('users')
    .child(id)
    .update({conversation: null});
  }

  render() {
    return (
      <View style={styles.Container}>
        <QRCode
          value={this.state.text}
          size={250}
          color={PRIMARY_LIGHT}
          logo={this.state.logo}
          logoSize={75}
          logoBorderRadius={100}
          logoMargin={2}/>
      </View>
    );
  };
}