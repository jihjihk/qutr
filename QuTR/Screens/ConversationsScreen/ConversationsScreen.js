import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
  ScrollView,
  Alert,
  ListView
} from 'react-native';
import { Container, Title, Text, } from 'native-base';
import { StackNavigator } from 'react-navigation';

import ToolbarButton from '../../Components/toolbarButton/ToolbarButton.js'
import ConversationsWindow from '../../Components/conversationsWindow/ConversationsWindow.js';
import Conversation from '../../Components/conversation/Conversation.js';

import { UserSchema, MessageSchema, ConversationSchema } from '../../Schemas.js';

import styles from './styles.js';
import { PRIMARY_DARK,
         PRIMARY,
         SECONDARY_DARK,
         SECONDARY
       } from '../../masterStyle.js';

const Realm = require('realm');
var self, count=0;

export default class ConversationsScreen extends Component<{}>  {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state= {
      loading: true,
      user: firebaseService.auth().currentUser,
      dataSource: ds
    };
    self = this
  }

  componentDidMount() {
    
    this.getProfilePicture();

    var urref = firebaseService.database().ref()
                .child('users')
                .child(this.state.user.uid)
                .child('userRooms');

    this.setState({urref: urref});

    /* Fetch all conversations for a user and sort them by timestamp in descending order */
    urref.orderByChild('reverseTimestamp').on('value', (e) => {
      var rows = [];
      if ( e && e.val() ) {                
          e.forEach(function(child) 
            {rows.push ( child )})
      }
      var ds = this.state.dataSource.cloneWithRows(rows);
      this.setState({
          dataSource: ds,
          loading: false
      });
    });
  }

  componentDidUnMount() {

    /* Turn off listeners */
    this.state.urref.off('value');

    firebaseService.database().ref()
      .child('users')
      .child(this.state.user.uid)
      .off('value');
  }

  getProfilePicture() {

    firebaseService.database().ref()
      .child('users')
      .child(this.state.user.uid)
      .once('value', function(snapshot) {
        var picture = snapshot.val().picture;
        self.setState({myPicture: picture});
      })
  }

  renderRow(rd) {

      /* Render an item in the conversation lists */
      var chatInfo = rd.val();
      var dateOfTs = new Date(rd.val().timestamp);
      var day = (dateOfTs.getDate() < 10) ? ""+0+dateOfTs.getDate() : dateOfTs.getDate();
      var month = (dateOfTs.getMonth() < 10) ? ""+0+(dateOfTs.getMonth()+1) : (dateOfTs.getMonth()+1);
      var date = day+"/"+month+"/"+dateOfTs.getFullYear();

      var hours = (dateOfTs.getHours()<10) ? ""+0+dateOfTs.getHours() : dateOfTs.getHours();
      var minutes = (dateOfTs.getMinutes()<10) ? ""+0+dateOfTs.getMinutes() : dateOfTs.getMinutes();

      var time = hours+":"+minutes;
      var message = chatInfo.message, name = chatInfo.theirName, picture = chatInfo.theirPicture;

      return <Conversation style={(count++%2==0) ? {backgroundColor: SECONDARY_DARK} : {backgroundColor: SECONDARY}}
                           roomID = {rd.key}
                           message = {message}
                           date = {date}
                           time = {time}
                           correspondent = {name}
                           correspondentKey = {chatInfo.theirID}
                           theirPicture = {picture || "https://www.jamf.com/jamf-nation/img/default-avatars/generic-user.png"}
                           myPicture = {this.state.myPicture || "https://www.jamf.com/jamf-nation/img/default-avatars/generic-user.png"}
                           navigation = {this.props.navigation} />;    
  }

  render() {

    if ( this.state.loading ) {
            return (<View style={{flex: 1, justifyContent:'center'}}>
                      <ActivityIndicator size="large"/>
                      <Text style={{textAlign: 'center'}}>Loading</Text>
                    </View>
            );
        }

    return (
      <Container ref="container" style={[styles.Container]}>
        <ConversationsWindow ref="cw"
                             contentContainerStyle={(this.state.dataSource._dataBlob.s1.length>0) ? {} : [styles.noConversations]}>
          {(this.state.dataSource._dataBlob.s1.length>0)
          ?
            <ListView dataSource={this.state.dataSource}
                      enableEmptySections={true}
                      renderRow={(rowData) => this.renderRow(rowData)}/>
          :
          <View>
            <Text>No conversations to show</Text>
          </View>
          }
          
        </ConversationsWindow>
      </Container>
   );
  }
}