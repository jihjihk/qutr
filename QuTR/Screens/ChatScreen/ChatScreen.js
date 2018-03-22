import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View,
  Keyboard,
  ActivityIndicator,
  ListView,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import { Container, Title, Text, Icon } from 'native-base';
import { Icon as ElementsIcon } from 'react-native-elements';
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
import Texts from "../../Texts.js"

const Firebase = require('firebase');
var self;

export default class ChatScreen extends Component<{}>  {

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
                conversation: null,
                myPicture: "",
                loading: true,
                dataSource: ds,
                selectionsVisible: false,
                message: '',
                renderPreviousSelections: [],
                previousSelections: [],
                previousSelectionIDs: [],
                selectedPhraseID: [],
                defaultLang: "English",
                trie: null,
                loading: true
              };
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));

    this.getChatInformation();
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
                  } else if (lang === "عربية") {
                    phraseData = ar;
                  } else if (lang === "中文") {
                    phraseData = cn;
                  }
                  if(phraseData) {
                    for (let pObj in phraseData) {
                      trie.insertPhrase(pObj, phraseData[pObj].phrase);
                    }
                  }
                  self.setState({
                    defaultLang: lang,
                    trie: trie,
                    phraseData: phraseData,
                    loading: false
                  })
                })
  }

  componentDidUnMount() {
    /* Turn off the listeners */
    firebaseService.database().ref()
      .child('users')
      .child(this.state.user.uid).off('value');

    firebaseService.database().ref()
        .child('conversations')
        .child(self.state.conversation)
        .off('value')
  }  

  getChatInformation = () => {

    firebaseService.database().ref()
    .child('users')
    .child(this.state.user.uid)
    .on('value', function(snapshot) {

      if (!!snapshot.val().conversation)
        self.setState({conversation: snapshot.val().conversation,
                       myPicture: snapshot.val().picture},
        /* I get metainformation about the conversation once*/
        function() {
          firebaseService.database().ref()
          .child('conversations')
          .child(self.state.conversation)
          .once('value')
          .then(function(snapshot) {

            var theirID = (snapshot.val().ID1==self.state.user.uid ? 
                           snapshot.val().ID2 : 
                           snapshot.val().ID1);

            firebaseService.database().ref()
            .child('users')
            .child(theirID)
            .once('value')
            .then(function(snapshot) {

              self.setState({theirName: snapshot.val().name,
                             theirPicture: snapshot.val().picture})
            });
          })

          /* This is obtaining messages continuously */
          firebaseService.database().ref()
          .child('conversations')
          .child(self.state.conversation)
          .limitToLast(20).on('value', (e) => {
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
        });
    })
  }

  sendMessage = () => {

    if (this.state.sendDisabled)  return;

    /* Read the text input, create a message, push to the database and clean up user interface */
    var selectedIDs = this.state.previousSelectionIDs;

    var newMessage = this.createMessage(this.state.user.uid, selectedIDs);
    var newMessageKey = this.getNewMessageKey();

    this.pushToConversation(newMessage, newMessageKey);

    this.setState({message: '',
                   renderPreviousSelections: [],
                   previousSelections: [],
                   previousSelectionIDs: [],
                   selectionsVisible: false
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
      .child(this.state.conversation)
      .push().key;
  }

  pushToConversation = (message, messageKey) => {

    firebaseService.database().ref()
      .child('conversations')
      .child(this.state.conversation)
      .child(messageKey)
      .set(message);

    firebaseService.database().ref()
    .child('conversations')
    .child(this.state.conversation)
    .update({'timestamp': message.timestamp});
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
    var unit = "";

    if (myLang == "عربية") phraseDB = ar;
    else if (myLang == "中文") phraseDB = cn;
    else phraseDB = en;

    //input array has 0 or 1 phrase only
    if (selectedPhraseID.length == 0) {
      return final;
    }

    //there is only 1 phrase ID in the array,
    //so we return the phrase by itself
    else if (selectedPhraseID.length == 1) {
      var onlypid = selectedPhraseID[0];
      final = phraseDB[onlypid].phrase;

      //extra whitespace removal if the phrase is returned as it self.
      if (final.includes(" *")) {
        final = final.replace(" *", "");
      }
      if (final.includes("* ")) {
        final = final.replace("* ", "");
      }
    }

    //input has 2 or more phrases
    else {      
      selectedPhraseID.forEach(function(pid) {
        //query is an integer; append as itself
        if (typeof(pid) == "number") {
          unit += pid;
        }
        //query item is a phrase id
        else {
          //query item is a complete sentence
          if (phraseDB[pid].pos == "sent") {
            final += phraseDB[pid].phrase + " ";
          }
          //if the query is a particle
          //CHECK if number is always at the beginning
          else if (phraseDB[pid].pos == "prt") {
            unit += phraseDB[pid].phrase;
          }
          else {
            if (phraseDB[pid].phrase.includes("*") && phraseDB[pid].pos == "vp") {
              temp = phraseDB[pid].phrase;
            }
            else
              np += phraseDB[pid].phrase.replace("*", "").toLowerCase();
          }
        }
      });
    }

    //if there is some number or unit
    if (unit != "") {
      np = unit + " " + np;
    }

    //replace asterisk with noun phrase or empty string
    if (temp != "")
      temp = temp.replace("*", np);
    final += temp;

    //capitalize the sentence if English
    if (myLang == "English") {
      final = final.charAt(0).toUpperCase() + final.slice(1);
    }

    return final;
  }

  createMessage = (ownerID, message) => {

    return {
      senderID: ownerID,
      message: message,
      timestamp: Firebase.database.ServerValue.TIMESTAMP
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
    if (this.state.renderPreviousSelections.length>0)
      this.setState({selectionsVisible: !this.state.selectionsVisible})
  }

  textChanged = (value, suggestionSelected, remainderString) => {

    var potentialMessage = this.state.message;
    var stringForSuggestions = value;
    
    if (suggestionSelected) {

      stringForSuggestions = remainderString;
      this.refs.mi.logAllProperties(this.refs.mi.input, remainderString);
    }
    
    /*
      Shehroze: Making a call to the trie to return a set of concepts based on given text input. The
      following function returns an array of 2-tuple [conceptID, count] arrays: [[c1, 2], [c2, 1], ... etc.]
    */
    let conceptCount = this.state.trie.suggConcepts(stringForSuggestions);
    // Preparing a list of possible concepts (stored as objects) for Jihyun's function and for the display
    let conceptsArray = []
    for(let i = 0; i < conceptCount.length; i++) {
      let cID = conceptCount[i][0];
      if (this.state.phraseData.hasOwnProperty(cID)) {
        let cPhrase = this.state.phraseData[cID].phrase;
        conceptsArray[i] = { ID: cID, phrase: cPhrase };
      }
    }
    stringForSuggestions!=="" ? 
      this.sendToSuggestionBar(conceptsArray) :
      this.sendToSuggestionBar([]);

    /* If everything in the message input is identical to our potential message, enable send */
    if (stringForSuggestions.length>0 || potentialMessage.length==0) this.disableSend();
    else this.enableSend();
  }

  /* This is where the current input is being sent to the suggestion bar 
     to generate placeholder suggestions with appended dots */
  sendToSuggestionBar = (suggestions) => {

    this.refs.sb.populate(suggestions);
  }

  compareObjs = (a, b) => {

    if (a.index < b.index)
      return -1;
    if (a.index > b.index)
      return 1;
    return 0;
  }

  /* Handle suggestion selection:
      * value is a textual representation of the suggestion
      * id is the concept id
  */
  selectSuggestion = (value, id) => {

    if (!value) return;
    this.setState({previousSelectionIDs: this.state.previousSelectionIDs.concat([id]),
                   previousSelections: this.state.previousSelections.concat([value]),
                   renderPreviousSelections: []},
      function(){
        /* Upon selecting a suggestion we want to generate the possible sentence out of the choices that we have 
           This will help us reorder selections in the message composer bar and give a more accurate picture to
           the user of what will be sent as a message */
        var message = self.generateSentence(self.state.previousSelectionIDs);
        self.setState({message: message}, function() {

          var helperArr=[];
          /* Sort all of the previous selections according to their indices in the projected message string */
          self.state.previousSelections.forEach(function(child) {
            var newChild=child.toLowerCase();
            
            if (child.includes("*")) newChild = newChild.replace(" *", "");
            if (child.includes("?")) newChild = newChild.replace("?", "");
            if (child.includes("!")) newChild = newChild.replace("!", "");
            helperArr.push({"text": child, "index": self.state.message.toLowerCase().indexOf(newChild) })
          })

          sortedHelperArr = helperArr;

          helperArr.sort(this.compareObjs);
          var newSelections = [];
          helperArr.forEach(function(child) {
            newSelections.push(child.text);
          })

          /* Once the previous selections have been sorted, call renderText() to display them,
             as well as textChanged to rerender text in the message input box */

          this.renderText(newSelections);
          /* I first pass the selection to Shehroze, 
             then he gives me back the remaining text, 
             the one that wasn't used to produce the suggestion 
             That text is the third parameter for the function
             E.g. If input is "I want 5" and a suggestion is "I want",
                  and the user selects it,
                  we pass 5 as the third parameter to the following function */
          this.textChanged(value, true, "");
        })
      })
  }

  /* This adds the selected suggestion to the message composer
     and handles the appropriate state changes */
  renderText = (previousSelections) => {
    var selection = [];
    previousSelections.forEach(function(child) {

      /* In state, a phrase and its ID are always at the same index
         in their respective containers */
      var indexInState = self.state.previousSelections.indexOf(child);
      var ID = self.state.previousSelectionIDs[indexInState];
      selection.push(<View key={self.state.previousSelections.length}
                         style={{flexDirection: 'row', alignItems:'center'}}>
                      <Text style={[styles.selectedSuggestion]}
                            overflow="hidden"
                            numberOfLines={1}>
                          {child}
                      </Text>
                      <TouchableOpacity onPress={() => {self.removeSelection(child, ID)}}>
                         <Icon name='md-remove-circle'
                               style={[styles.removeSelection]}>
                         </Icon>                                     
                      </TouchableOpacity>
                    </View>);
    })

    this.setState({renderPreviousSelections: selection});
  }

  /* Removes the selection from the message composer and memory */
  removeSelection = (deletedSelection, ID) => {    

    /* Call renderText later */
    var previousSelections = this.state.previousSelections;
    var previousSelectionIDs = this.state.previousSelectionIDs;
    
    var index = previousSelections.indexOf(deletedSelection);

    previousSelections.splice(index, 1);
    previousSelectionIDs.splice(index, 1);
    
    this.setState({previousSelections: previousSelections,
                   previousSelectionIDs: previousSelectionIDs,
                   renderPreviousSelections: []
                  }, 

                   function() {
                      
                      self.setState({message: this.generateSentence(self.state.previousSelectionIDs)}, 
                                    function() {

                                      //alert("Message: "+self.state.message+",\nPrevious selections: "+self.state.previousSelections.toString()+",\nIDs: "+self.state.previousSelectionIDs.toString()+",\nRemoved: "+deletedSelection);
                                      self.renderText(self.state.previousSelections);

                                      /* Clean up if no suggestions are left selected */
                                      if (self.state.previousSelections.length==0 || 
                                          self.state.message=="") {

                                        this.disableSend();
                                        this.setState({selectionsVisible: false})
                                      }
                                    })
                   })    
  }


  renderRow = (rd) => {

    if (!!rd.val().message) 
      var message = this.generateSentence(rd.val().message)
    else var message=""

    if (rd.val().senderID==this.state.user.uid)  {

      return (<View style={[styles.myMessageView]}>
                <Message message={message} 
                         style={[styles.myMessage]}/>
                <Image source={{uri: this.state.myPicture}} 
                       style={[styles.picture]}/>
              </View>);
      }

      else if (!!rd.val().senderID) {

        return (<View style={[styles.theirMessageView]}>
                  <Image source={{uri: this.state.theirPicture}} 
                         style={[styles.picture]}/>
                  <Message message={message} 
                           style={[styles.theirMessage]}/>
                </View>);
    }

    else return null;
  }

  render() {

    if (this.state.loading) {
      return (      <View style={{flex: 1, justifyContent:'center'}}>
                      <ActivityIndicator size="large"/>
                    </View>)
    }
    
    if (!!this.state.conversation) 

    return (
      <Container ref="container" style={[styles.Container]}>

          <Header center={<Title style={[styles.Title]}>{this.state.theirName}</Title>}/>
          <ChatWindow ref="cw">

            { this.state.loading ? <View style={{flex: 1, justifyContent:'center'}}>
                                      <ActivityIndicator size="large"/>
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

          <Footer left={<TouchableHighlight style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                          <ElementsIcon color={(this.state.renderPreviousSelections.length>0) ? 
                                                 SECONDARY : 'black'}
                                        name='thought-bubble' 
                                        type='material-community'
                                        underlayColor='transparent'
                                        onPress={() => this.toggleSelections()}>
                          </ElementsIcon>
                        </TouchableHighlight>}

                  center={<MessageInput ref='mi' 
                                        onChangeText={(value) => this.textChanged(value, false)}
                                        placeholder={Texts.inputPlaceholder[this.state.defaultLang]}>
                          </MessageInput>} 
                  right={<ToolbarButton style={this.state.sendStyle} 
                                        name='md-send' 
                                        onPress={() => this.sendMessage()}/>}/>
          <SuggestionBar ref='sb' 
                         select = {(suggestion, id) => this.selectSuggestion(suggestion, id)}>    
          </SuggestionBar>
      </Container>
   );
    
   return (
      <Container ref="container" style={[styles.noConversations]}>
        <View>
          <Text>{Texts.noConversations[this.state.defaultLang]}</Text>
        </View>
      </Container>
   );

  }
}