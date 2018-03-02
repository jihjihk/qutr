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

import ar from './phrases_json/ar.json';
import en from './phrases_json/en.json';
import cn from './phrases_json/cn.json';

import Trie from '../../DataStructures/Trie.js';

const Firebase = require('firebase');
var self;

export default class ChatScreen extends Component<{}>  {

  static navigationOptions = { header: null };

  /* *** message is the fully constructed sentences after generateSentence()
  while selectedPhraseID is an array of raw phrase IDs selected by the user.

  We should probably send the other chat conversant the selectedPhraseID array
  instead of "message" and call generateSentence() before displaying.

  */
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
                previousSelections: [],
                selectedPhraseID: [],
                defaultLang: "English",
                trie: null
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

    firebaseService.database().ref()
                .child('users')
                .child(this.state.user.uid)
                .once('value')
                .then(function(snapshot) {
                  /*
                    Shehroze:
                    Retrieve user language from Firebase and initialize the Trie with the appropriate data.
                  */
                  let lang = snapshot.val().language;
                  let trie = new Trie();
                  let phraseData = null;
                  if (lang === "English") {
                    phraseData = en;
                  } else if (lang === "Arabic") {
                    phraseData = ar;
                  } else if (lang === "Chinese") {
                    phraseData = cn;
                  }
                  if(phraseData) {
                    for (let pObj in phraseData) {
                      trie.insertPhrase(pObj, phraseData[pObj].phrase);
                    }
                  }
                  self.setState({
                    defaultLang: lang,
                    trie: trie
                  })
                })

  }

  componentDidUnMount() {
    /* Turn off the listeners */
    firebaseService.database().ref()
      .child('users')
      .child(this.state.user.uid).off('value');

    this.state.urref.off('value')
  }  

  /* *** Sending the chat coresspondent selectedPhraseID arr instead of a full sentence?
  */

  sendMessage = () => {

    if (this.state.sendDisabled)  return;

    /* Read the text input, create a message, update proper database entries and clean up the interface */
    var text=this.state.message;

    /* *** This code should be where the generateSentence() function is called
    to construct a sentence from an array of phrase IDs

    var selectedPhraseID = this.state.selectedPhraseID;
    var text = generateSentence(selectedPhraseID);
    */

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

  /* *** Jihyun: this is where my function is. It receives an array of phrase IDs
  and given the defaultLang info in state, it generates a sentence using some rules.
  Up top of this .js file, I imported json files of phrases and their IDs

  This function should be called whenever the user hits send so that
    1) sender's own chat screen renders a full complete sentence
    2) receiver's chat screen also renders a full sentence but in a different language

  But considering how Shehroze is selecting phrases directly and not their corresponding IDs,
  should we have a separate data structure that is a reverse {phrase: ID} relationship so it's fast to look up?
  */
  
  generateSentence = (selectedPhraseID) => {

    var myLang = this.state.defaultLang;
    var phraseDB;

    var np = "";
    var temp = "";
    var final = "";

    if (myLang == "Arabic") phraseDB = ar;
    else if (myLang == "Chinese") phraseDB = cn;
    else phraseDB = en;

    selectedPhraseID.forEach(function(pid) {
      if (typeof(pid) == "number") {
        np += pid;
      }

      else {
        if (en[pid].pos == "phrs") {
          final += en[pid].phrase + " ";
        }
        else {
          if (en[pid].phrase.includes("*") && en[pid].pos == "vp") {
            temp = en[pid].phrase;
          }
          else
            np += en[pid].phrase.replace("*", "").toLowerCase();
        }
      }
    });

    if (temp != "")
      temp = temp.replace("*", np);
    final += temp;

    //this.setState({message: final});

    return final;
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

    var potentialMessage = this.state.message;
    var stringForSuggestions = value;

    if (suggestionSelected) {

      stringForSuggestions = remainderString;
      this.refs.mi.logAllProperties(this.refs.mi.input, remainderString);
    }
    else {

      /*
        Shehroze: Making a call to the trie to return a set of concepts based on given text input. The
        following function returns an array of 2-tuple [conceptID, count] arrays: [[c1, 2], [c2, 1], ... etc.]
      */
      let conceptCount = this.state.trie.suggConcepts(stringForSuggestions);
      let conceptsArray = []  // Preparing a list of possible concepts for Jihyun's function
      for(let i = 0; i < conceptCount.length; i++) {
        conceptsArray[i] = conceptCount[i][0];
      }
      this.setState({
        selectedPhraseID: conceptsArray
      }, function() {Alert.alert('selectedPhraseID', conceptsArray.toString())});
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