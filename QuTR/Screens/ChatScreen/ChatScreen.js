import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View,
  Keyboard,
  ActivityIndicator,
  ListView,
  Image,
  Alert,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Container, Title, Text, Badge } from 'native-base';
import { StackNavigator } from 'react-navigation';

import ToolbarButton from '../../Components/toolbarButton/ToolbarButton.js';
import MessageInput from '../../Components/messageInput/MessageInput.js';
import Message from '../../Components/message/Message.js';
import ChatWindow from '../../Components/chatWindow/ChatWindow.js';
import SuggestionButton from '../../Components/suggestionButton/SuggestionButton.js';
import SuggestionBar from '../../Components/suggestionBar/SuggestionBar.js';
import Header from '../../Components/header/Header.js';
import Footer from '../../Components/footer/Footer.js';

import styles from './styles.js';

import { BLACK, 
         SECONDARY_LIGHT,
         PRIMARY_DARK,
         SECONDARY,
         PRIMARY } from '../../masterStyle.js'

const Firebase = require('firebase');
var self;

export default class ChatScreen extends Component<{}>  {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    self=this;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state={sendDisabled: true,
                sendStyle: {color: BLACK},
                user: firebaseService.auth().currentUser,
                myPicture: "",
                loading: true,
                dataSource: ds,
                selectionsVisible: false,
                message: '',
                renderPreviousSelections: [],
                previousSelections: []
              };
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

   _keyboardDidShow () {
    this.refs.cw.onKeyboardShow();
    this.refs.sb.onKeyboardShow();
  }

  _keyboardDidHide () {
    this.refs.cw.onKeyboardHide();
    this.refs.sb.onKeyboardHide();
  }

  componentDidMount() {

    var urref = firebaseService.database().ref()
                .child('users')
                .child(this.state.user.uid)
                .child('userRooms')
                .child(this.props.navigation.state.params.roomID);

    this.setState({urref: urref});

    urref.orderByChild('timestamp').limitToLast(20).on('value', (e) => {
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
    /* Turn off the listeners */
    firebaseService.database().ref()
      .child('users')
      .child(this.state.user.uid).off('value');

    this.state.urref.off('value')
  }  

  sendMessage = () => {

    if (this.state.sendDisabled)  return;

    /* Read the text input, create a message, update proper database entries and clean up the interface */
    var text="";
    var previousSelections = this.state.previousSelections;
    previousSelections
    .forEach(function(child) 
      {
        text+=child+" ";
      })

    var newMessage = this.createMessage(this.state.user.uid, text);
    var newMessageKey = this.getNewMessageKey();

    this.pushToUserChatrooms(newMessage, this.state.user.uid, newMessageKey);
    this.pushToUserChatrooms(newMessage, this.props.navigation.state.params.correspondentKey, newMessageKey);

    this.setState({message: '',
                   renderPreviousSelections: [],
                   previousSelections: []
                 });

    this.refs.mi.clearContent();
    this.refs.sb.clean();
    this.disableSend();    
  }

  getNewMessageKey = () => {
    return firebaseService.database().ref()
      .child('users')
      .child(this.state.user.uid)
      .child('userRooms')
      .child(this.props.navigation.state.params.roomID)
      .push().key;
  }

  pushToUserChatrooms = (message, userID, messageKey) => {

    firebaseService.database().ref()
      .child('users')
      .child(userID)
      .child('userRooms')
      .child(this.props.navigation.state.params.roomID)
      .child(messageKey)
      .set(message);

    /* Update so that this information can be used to show
       a list of conversations in the ConversationsScreen */
    this.updateLatestMessage(message, userID);
  }

  updateLatestMessage = (message, userID) => {

    firebaseService.database().ref()
      .child('users')
      .child(userID)
      .child('userRooms')
      .child(this.props.navigation.state.params.roomID)
      .update({message: message.message, 
               timestamp: message.timestamp, 
               reverseTimestamp: message.reverseTimestamp});
  }

  createMessage = (ownerID, message) => {

    return {
      senderID: ownerID,
      message: message,
      timestamp: Firebase.database.ServerValue.TIMESTAMP,
      reverseTimestamp: 0 - new Date().getTime()
    };
  }  

  enableSend = () => {
    this.setState({sendDisabled: false,
                  sendStyle: {color: SECONDARY_LIGHT}});
  }

  disableSend = () => {

    this.setState({sendDisabled: true,
                  sendStyle: {color: BLACK}
                });
  }

  toggleSelections = () => {
    this.setState({selectionsVisible: !this.state.selectionsVisible})
  }

  textChanged = (value, suggestionSelected, remainderString) => {

    var previousSelections = this.state.previousSelections;
    var potentialMessage = this.state.message;
    var stringForSuggestions = value;

    if (suggestionSelected) {

      stringForSuggestions = remainderString;
      this.refs.mi.logAllProperties(this.refs.mi.input, remainderString);
    }
    else {

      previousSelections
      .forEach(function(child) 
        {
          /* stringForSuggestions is the string which is in the text input
             but hasn't been selected by the user yet.
             This is handling the text that is in the message input 
             before the user has selected a suggestion, 
             not the one returned by Shehroze's function */
          if (stringForSuggestions.includes(child))
            stringForSuggestions = stringForSuggestions.replace(child+" ", ""); 
        })
    }

    /* If everything in the message input is identical to our potential message, enable send */
    if (stringForSuggestions.length>0 || potentialMessage.length==0) this.disableSend();
    else this.enableSend();

    this.sendToSuggestionBar(stringForSuggestions);
  }

  /* This is where the current input is being sent to the suggestion bar 
     to generate placeholder suggestions with appended dots */
  sendToSuggestionBar = (value) => {

    this.refs.sb.populate(value);
  }

  selectSuggestion = (value) => {

    if (!value) return;
    this.renderText(value);
    /* I first pass the selection to Shehroze, 
       then he gives me back the remaining text, 
       the one that wasn't used to produce the suggestion 
       That text is the third parameter for the function
       E.g. If input is "I want 5" and a suggestion is "I want",
            and the user selects it,
            we pass 5 as the third parameter to the following function */
    this.textChanged(value, true, "");
  }

  /* This adds the selected suggestion to the message composer
     and handles the appropriate state changes */
  renderText = (input) => {
    var selection = [];
    selection.push(<TouchableOpacity onLongPress={() => {this.removeSelection(input)}}
                                     key={this.state.previousSelections.length}>
                    <Text style={[styles.selectedSuggestion]}
                          overflow="hidden"
                          numberOfLines={1}>
                        {input}
                    </Text>
                   </TouchableOpacity>);

    this.setState({renderPreviousSelections: this.state.renderPreviousSelections.concat(selection),
                   message: this.state.message+=input+" ",
                   previousSelections: this.state.previousSelections.concat([input])});
  }

  /* Removes the selection from the message composer */
  removeSelection = (deletedSelection) => {    

    var helper = this.state.previousSelections;
    var renderHelper = this.state.renderPreviousSelections;
    var messageHelper = this.state.message;
    var index = helper.indexOf(deletedSelection);

    if (index !== -1) {

      helper.splice(index, 1);
      renderHelper.splice(index, 1);
      messageHelper = messageHelper.replace(deletedSelection+" ", ""); 
    }

    /* Clean up if no suggestions are left selected */
    if (helper.length==0) this.disableSend();

    this.setState({renderPreviousSelections: renderHelper,
                   previousSelections: helper,
                   message: messageHelper})
  }


  renderRow = (rd) => {

    if (rd.val().senderID==this.state.user.uid)  {

      return (<View style={[styles.myMessageView]}>
                <Message message={rd.val().message} 
                         style={[styles.myMessage]}/>
                <Image source={{uri: this.props.navigation.state.params.myPicture}} 
                       style={[styles.picture]}/>
              </View>);
      }

      else if (!!rd.val().senderID) {

        return (<View style={[styles.theirMessageView]}>
                  <Image source={{uri: this.props.navigation.state.params.picture}} 
                         style={[styles.picture]}/>
                  <Message message={rd.val().message} 
                           style={[styles.theirMessage]}/>
                </View>);
    }

    else return null;
  }

  render() {
    return (
      <Container ref="container" style={[styles.Container]}>
        <Header center={<Title style={[styles.Title]}>{this.props.navigation.state.params.name}</Title>}/>
        <ChatWindow ref="cw">

          { this.state.loading ? <View style={{flex: 1, justifyContent:'center'}}>
                                    <ActivityIndicator size="large"/>
                                    <Text style={{textAlign: 'center'}}>Loading</Text>
                                  </View>
                                :
                                <ListView dataSource={this.state.dataSource}
                                          enableEmptySections={true}
                                          renderRow={(rowData) => this.renderRow(rowData)}/>
          }
          
        </ChatWindow>

        {this.state.selectionsVisible ? <View style={[styles.scrollWrapper]}>
                                          <ScrollView style={[styles.selectionList]}
                                                      horizontal={true}
                                                      contentContainerStyle={[styles.childLayout]}
                                                      overflow="hidden"
                                                      scrollEnabled={true}
                                                      showsHorizontalScrollIndicator = {false}>
                                            {(!!this.refs.mi) ? 
                                              this.state.renderPreviousSelections : null}
                                          </ScrollView>
                                        </View>
                                      :
                                      null}

        <Footer left={<ToolbarButton style={(this.state.renderPreviousSelections.length>0) ? 
                                            {color: SECONDARY} : {color: 'black'}}
                                     name='md-mail' 
                                     onPress={() => this.toggleSelections()}>
                        {(this.state.renderPreviousSelections.length>0) 
                          ? 
                          <Badge success
                                 style={[styles.badge]}>
                            <Text style={[styles.badgeText]}>
                              {this.state.renderPreviousSelections.length}
                            </Text>
                          </Badge>
                          :
                          null
                        }
                      </ToolbarButton>}

                center={<MessageInput ref='mi' 
                                      onChangeText={(value) => this.textChanged(value, false)}>
                        </MessageInput>} 
                right={<ToolbarButton style={this.state.sendStyle} 
                                      name='md-send' 
                                      onPress={() => this.sendMessage()}/>}/>
        <SuggestionBar ref='sb' 
                       select = {(suggestion) => this.selectSuggestion(suggestion)}>    
        </SuggestionBar>
      </Container>
   );
  }
}