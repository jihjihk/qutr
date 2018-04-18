import firebaseService from '../../services/firebase';
import React, { Component } from 'react';
import {
  View,
  Alert,
  Keyboard,
  ActivityIndicator,
  ListView,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions
} from 'react-native';
import { Container, Title, Text, Icon } from 'native-base';
import { Icon as ElementsIcon } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { DotIndicator } from 'react-native-indicators'

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
         PRIMARY_LIGHT,
         SECONDARY,
         PRIMARY } from '../../masterStyle.js'

import ar from './phrases_json/ar.json';
import en from './phrases_json/en.json';
import cn from './phrases_json/cn.json';
import cn_split from './phrases_json/cn_split.json';

import Trie from '../../DataStructures/Trie.js';
import Texts from "../../Texts.js"

const Firebase = require('firebase');
const windowWidth = Dimensions.get('window').width;
const SUGGESTIONS_ALLOWED = 15;

export default class ChatScreen extends Component<{}>  {

  /* *** message is the fully constructed sentences after generateSentence()
  */

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state={sendDisabled: true,
                sendStyle: {color: BLACK},
                user: firebaseService.auth().currentUser,
                conversation: null,
                myPicture: "",
                loading: true,
                dataSource: ds,
                selectionsVisible: false,
                messageVisible: true,
                message: '',
                selections: [],
                defaultLang: "English",
                trie: null,
                theyAreTyping: false,
                conversationRef: null,
                userRef: null,
                suggestions: [],
                suggestionsForRendering: [],
                amountShown: SUGGESTIONS_ALLOWED,
                sbStyle: [styles.withoutKeyboard],
                footerLeftIcon: 'message',
                currentInput: ''
              };
  }

  componentWillMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', 
                                                        this._keyboardDidShow.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', 
                                                        this._keyboardDidHide.bind(this));
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

   _keyboardDidShow () {
    this.refs.cw.onKeyboardShow();
    this.setState({sbStyle: [styles.withKeyboard]});
  }

  _keyboardDidHide () {
    this.refs.cw.onKeyboardHide();
    this.setState({sbStyle: [styles.withoutKeyboard]})
  }

  componentDidMount() {

    var userRef = firebaseService.database().ref()
                  .child('users')
                  .child(this.state.user.uid);

    userRef
    .once('value')
    .then((snapshot) => {
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
          let phrase = (lang === "中文") ? cn_split[pObj].phrase : phraseData[pObj].phrase;
          if (!phrase) trie.insertPhrase(pObj, "");
          else trie.insertPhrase(pObj, phrase);
        }
      }
      this.setState({
        defaultLang: lang,
        trie: trie,
        phraseData: phraseData,
        loading: false,
        userRef: userRef
      }, () => {this.getChatInformation()})
    })
  }

  componentDidUnMount() {
    /* Turn off the listeners */
    this.state.userRef.off('value');
    this.state.conversationRef.off('value')
  }  

  getChatInformation = () => {

    /* Listener type has to be 'on', not 'once', because messages are being sent continuously */
    this.state.userRef
    .on('value', (snapshot) => {

      var conversation = snapshot.val().conversation;

      if (!!conversation) {

        var conversationRef = firebaseService.database().ref()
                              .child('conversations')
                              .child(conversation);
        
        /* Get my information for display */
        this.setState({conversation: conversation,
                       conversationRef: conversationRef,
                       myPicture: snapshot.val().picture},
        () => {          
          
          this.fetchCorrespondentInformation();

          /* This is obtaining messages continuously */
          this.state.conversationRef
          .on('value', (snapshot) => {
            var rows = [], snapshotValue = snapshot.val();
            if (snapshot && snapshotValue) {                
              snapshot.forEach((child) => {
                rows.push ( child )
              })
            }
            var ds = this.state.dataSource.cloneWithRows(rows);
            var theyAreTyping = (!!this.state.theirID && !!snapshotValue) ? 
                                snapshotValue[this.state.theirID] : 
                                false;
            this.setState({
                dataSource: ds,
                loading: false,
                theyAreTyping: theyAreTyping
            });
          });
        })
      }
    })
  }

  fetchCorrespondentInformation = () => {

    this.state.conversationRef
    .once('value')
    .then((snapshot) => {

      var snapshotValue = snapshot.val();
      var theirID = (snapshotValue.ID1==this.state.user.uid ? 
                     snapshotValue.ID2 : 
                     snapshotValue.ID1);

      firebaseService.database().ref()
      .child('users')
      .child(theirID)
      .once('value')
      .then((snapshot) => {

        this.setState({theirName: snapshot.val().name,
                       theirPicture: snapshot.val().picture,
                       theirID: theirID})
      });
    })
  }

  sendMessage = () => {

    if (this.state.sendDisabled)  return;

    /* Read the text input, create a message, push to the database and clean up user interface */
    var selectedIDs = this.getSelectionIDs(this.state.selections);

    var message = this.createMessage(this.state.user.uid, selectedIDs);
    var messageKey = this.getNewMessageKey();

    this.addNewMessageToConversation(message, messageKey);
    this.amTyping(false);

    this.setState({message: '',
                   selections: [],
                   selectionsVisible: false,
                   suggestionsForRendering: [],
                   suggestions: []
                 });

    this.refs.mi.clearContent();
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

  addNewMessageToConversation = (message, messageKey) => {

    this.state.conversationRef
    .child(messageKey)
    .set(message);

    this.state.conversationRef
    .update({'timestamp': message.timestamp});
  }

  getSelectionIDs = (selections) => {

    var selectionIDs = [];
    selections.forEach((child) => {
      let ID = (!isNaN(Number(child.ID))) ? Number(child.ID) : child.ID;
      selectionIDs.push(ID);
    })

    return selectionIDs;
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
  
  hasNumber = (myString) => {
    return /\d/.test(myString);
  }

  capitalize = (myString) => {
    return myString.charAt(0).toUpperCase() + myString.slice(1);
  }

  getPhrase = (db, idstr) => {
    try {
      return phrase = db[idstr].phrase;
    } catch (err) {
      return null;
    }
  }

  getPos = (db, idstr) => {
    try {
      return phrase = db[idstr].pos;
    } catch (err) {
      return null;
    }
  }

  removeAllAsterisk = (final) => {
    var astlist = [" *", "* ", "*"]
    final+="";

    //extra whitespace removal if the phrase is returned as it self.

    astlist.forEach((ast) => {
      if (final.includes(ast)) {
        final = final.replace(ast, "");
      }
    })
    return final;
  }

  generateSentence = (selectedPhraseID) => {

    var myLang = this.state.defaultLang;
    var phraseDB;

    var np = "",
      temp = "",
      final = "",
      unit = "";

    var nounArr = [];
    var numArr = [];

    if (myLang == "عربية")
      phraseDB = ar;
    else if (myLang == "中文")
      phraseDB = cn;
    else
      phraseDB = en;

    //input array has 0
    if (selectedPhraseID.length == 0) {
      return final;
    }

    //there is only 1 phrase ID in the array,
    //so we return the phrase by itself
    else if (selectedPhraseID.length == 1) {

      var pid = selectedPhraseID[0];
      var phrase = this.getPhrase(phraseDB, pid);
      final = (phrase) ? phrase : pid;
      return this.capitalize(this.removeAllAsterisk(final));

    }

    //input has 2 or more phrases
    else {

      selectedPhraseID.forEach((pid) => {

        var myPhrase = this.getPhrase(phraseDB, pid);
        var myPos = this.getPos(phraseDB, pid);

        //query item is a phrase id
        if (myPhrase) {

          //query item is a complete sentence
          if (myPos == "sent") {
            final += myPhrase + " ";
          }
          //query item is a template
          else if (myPhrase.includes("*")) {
            if (myPos == "vp") {
              temp += myPhrase + " ";
            } else if (myPos == "prt") {
              unit = myPhrase;
            }
          }
          //query item is NP, ADJ, ADV or VP and PRT without *
          else {
            //if this phrase is a noun, then insert at the beginning of chunk array 
            //to increase priority of replacement

            if (myPos == "np")
              nounArr.unshift(myPhrase);
            else
              nounArr.push(myPhrase);
          }
        }

        //query is a number, time, date or a unseen word;
        // append as itself
        else {
          //word is JUST A NUMBER
          if (typeof(pid) == "number") {
            numArr.push(pid);
          }
          //word is a string BUT CONTAINS A NUMBER (maybe date time object or a FLIGHT NUMBER)
          else if (this.hasNumber(pid)) {
            //for now just treat as a noun object
            nounArr.unshift(pid);

          }
          //word is just an unseen string of characters
          //maybe a proper noun etc
          else {
            nounArr.push(pid);
          }
        }
      });
    }

    //user selected one of the particles with *
    if (unit != "") {
      if (numArr.length > 0) {
        //replace unit particle with the first number we see,
        //then pop the first number in numArr because it's already used
        //then insert the newly constructed number+particle word as a noun phrase into nounArr
        unit = unit.replace("*", numArr[0]);
        numArr.shift();
        nounArr.unshift(unit);
      }
      //user input a particle but not a number
      //in this case just remove asterisk and insert into nounArr
      else {
        nounArr.unshift(this.removeAllAsterisk(unit));
      }
    }
    //input number but not enough particles, so we just push them into nounArr
    nounArr = nounArr.concat(numArr);

    //handling template replacement
    while (temp.includes("*")) {
      if (nounArr.length > 0) {
        temp = temp.replace("*", nounArr[0]);
        nounArr.shift();
      } else {
        temp = temp.replace("*", " ");
      }
    }
    final += temp;

    //handling leftover noun phrases
    final += nounArr.join(". ");

    return this.capitalize(final);
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

  amTyping = (truth) => {

    this.state.conversationRef
    .update({[this.state.user.uid]: truth})    
  }

  textChanged = (value, suggestionSelected, remainderString) => {

    var conceptsArray, 
        stringForSuggestions, 
        potentialMessage = this.state.message;
    
    /* Check that the user is not entering an empty string */
    if (/\S/.test(value)) 
      stringForSuggestions = value;
    else stringForSuggestions = "";

    this.scrollToBeginning('sb');
    
    if (suggestionSelected) {

      stringForSuggestions = remainderString;
      this.refs.mi.logAllProperties(this.refs.mi.input, remainderString);
    }

    this.setState({suggestions: [],
                   amountShown: SUGGESTIONS_ALLOWED});

    // var splitSuggestionString = stringForSuggestions.replace(/^\s+|\s+$/g, '').toLowerCase().split(" ");  // Remove extra whitespace and split
    // var copy = splitSuggestionString;
    // let numArray = [];
    
    // splitSuggestionString.forEach((word) => {
      
    //   if(isNaN(parseFloat(word))) {
    //     // Check if integer
    //     if(!isNaN(parseInt(word))) {
    //       numArray.push({ ID: parseInt(word), phrase: parseInt(word)+"" });
    //       //copy.splice(copy.indexOf(word), 1);
    //     }
    //   } else {
    //     // Float
    //     numArray.push({ ID: parseFloat(word), phrase: parseFloat(word)+"" });
    //     //copy.splice(copy.indexOf(word), 1);
    //   }
    // });

    /* Send my typing info to the database */
    if (stringForSuggestions.length>0 || suggestionSelected)  
      this.amTyping(true);
    else this.amTyping(false); 
    
    conceptsArray = this.getConcepts(stringForSuggestions);
    //conceptsArray = numArray.concat(conceptsArray);

    stringForSuggestions!=="" ? 
      this.sendToSuggestionBar(conceptsArray) :
      this.sendToSuggestionBar([]);
  }

  getConcepts = (stringForSuggestions) => {
    /*
      Shehroze: Making a call to the trie to return a set of concepts based on given text input. The
      following function returns an array of 2-tuple [conceptID, count] arrays: [[c1, 2], [c2, 1], ... etc.]
    */
    let conceptCount = this.state.trie.suggConcepts(stringForSuggestions);
    if (conceptCount.length === 0) return [{ ID: stringForSuggestions, phrase: stringForSuggestions }];

    conceptCount.sort((a, b) => {
      if(b[1] - a[1] === 0) { // Sorting concepts by phrase length
        return this.state.phraseData[a[0]].phrase.length - 
              this.state.phraseData[b[0]].phrase.length;
      } else return b[1] - a[1];
    });
    
    // Preparing a list of possible concepts (stored as objects) for Jihyun's function and for the display
    let conceptsArray = [];
    var conceptCountLength = conceptCount.length;
    for(let i = 0; i < conceptCountLength; i++) {
      let cID = conceptCount[i][0];
      if (this.state.phraseData.hasOwnProperty(cID)) {
        let cPhrase = this.state.phraseData[cID].phrase;
        conceptsArray[i] = { ID: cID, phrase: cPhrase };
      }
    }
    return conceptsArray;
  }

  sendToSuggestionBar = (suggestions) => {

    var tempSuggestions = (suggestions.length < SUGGESTIONS_ALLOWED) ? 
                           suggestions : 
                           suggestions.slice(0, SUGGESTIONS_ALLOWED)
    this.setState({suggestions: suggestions,
                   suggestionsForRendering: tempSuggestions});
  }

  loadExtraSuggestions = () => {

    var newAmountShown = this.state.amountShown+SUGGESTIONS_ALLOWED;
    var tempSuggestions = this.state.suggestions.slice(0, newAmountShown);

    this.setState({suggestionsForRendering: tempSuggestions,
                   amountShown: newAmountShown});
  }

  selectSuggestion = (item) => {

    if (!item.phrase) return;

    var newSelections = this.state.selections.concat(item);
    var IDs = this.getSelectionIDs(newSelections);
    var message = this.generateSentence(IDs);

    if (message!="") this.enableSend();

    this.setState({selections: newSelections,
                   selectionsVisible: true, 
                   message: message});

    this.textChanged("", true, "");
  }

  /* This adds the selected suggestion to the message composer
     and handles the appropriate state changes */
  renderSelection = (item) => {

    var selection = item.item;
    var index = item.index;

    return (<View key={this.state.selections.length}
                  style={{flexDirection: 'row', alignItems:'center'}}>
              <Text style={[styles.selectedSuggestion]}
                    overflow="hidden"
                    numberOfLines={1}>
                  {selection.phrase}
              </Text>
              <TouchableOpacity onPress={() => {this.removeSelection(index)}}>
                 <Icon name='md-remove-circle'
                       style={[styles.removeSelection]}>
                 </Icon>                                     
              </TouchableOpacity>
            </View>);
  }

 scrollToBeginning = (ref) => {

    if (!!this.refs[ref])
      this.refs[ref].scrollToOffset(0);
  }

  /* Removes the selection from the message composer and memory */
  removeSelection = (index) => {    

    var selections = this.state.selections;
    selections.splice(index, 1);

    var selectionIDs = this.getSelectionIDs(selections),
        message = this.generateSentence(selectionIDs);
    
    this.setState({selections: selections,
                   message: message,
                   footerLeftIcon: 'composer'}); 
    
    this.scrollToBeginning('cb');
    /* Clean up if no suggestions are left selected */
    if (selections.length==0 || 
        message=="") {

      this.disableSend();
      this.setState({selectionsVisible: false});
      this.amTyping(false);
    }
  }

  keyExtractor = (item, index) => item.ID+"" || item.phrase+"" || item+"";

  getSuggestionWidth = () => {

    var widthDivisor = this.state.suggestionsForRendering.length;
    return {minWidth: (windowWidth-60)/widthDivisor};
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

  renderMessagesContainer = () => {

    return 

    (<ListView dataSource={this.state.dataSource}
                enableEmptySections={true}
                renderRow={(rowData) => this.renderRow(rowData)}/>  
    );
  }

  renderTypingIndicator = () => {

    if (this.state.theyAreTyping)

    return (
      <View style={[styles.theirMessageView]}>
        <Image source={{uri: this.state.theirPicture}} 
               style={[styles.picture]}/>
        <DotIndicator color={PRIMARY_DARK}
                      count={3}
                      size={5}
                      style={[styles.dotIndicator]}/>
      </View>)
  }

  renderLoadingIndicator = () => {

    return ( <View style={[styles.activityIndicator]}>
                <ActivityIndicator size="large"/>
              </View>)
  }

  renderComposerBar = () => {

    return (<View style={[styles.scrollWrapper]}>
                <FlatList data={this.state.selections}
                          renderItem={(item) => this.renderSelection(item)}
                          keyExtractor={this.keyExtractor}
                          horizontal
                          scrollable={true}
                          ref='cb'>
                </FlatList>
              </View>);
  }

  renderPotentialMessage = () => {

    return (<ScrollView style={[styles.scrollWrapper]}
                          horizontal
                          scrollable={true}>
                <Text style={{color: 'white', textAlignVertical: 'center', fontSize: 18, marginRight: 10}}>
                  {this.state.message}
                </Text>
              </ScrollView>);
  }

  noConversationsPlaceholder = () => {

    return (
      <Container ref="container" style={[styles.noConversations]}>
        <View>
          <Text>{Texts.noConversations[this.state.defaultLang]}</Text>
        </View>
      </Container>
   );
  }

  noSuggestionsPlaceholder = () => {

    return (<View style={[styles.noSuggestionsContainer]}>
              <Text style={[styles.noSuggestionsText]}>
                {Texts.noSuggestions[this.state.defaultLang]}
              </Text>
            </View>)
  }

  renderSuggestionBar = () => {

    return (

      <View style={{flexDirection: 'row'}}>
      
       <View style={{flex: 1}}>
        <FlatList data = {this.state.suggestionsForRendering}
                  renderItem={({ item }) => 
                  <SuggestionButton text={item.phrase}
                                    id={item.ID}
                                    toSelect={() => this.selectSuggestion(item)}
                                    style = {this.getSuggestionWidth()}/>
                  }
                  keyExtractor={this.keyExtractor}
                  horizontal
                  ref='sb'>
        </FlatList>
      </View>
      <TouchableHighlight style={[styles.showMoreButton]}>
        <ElementsIcon color={(this.state.suggestions.length>this.state.amountShown) ? 
                              PRIMARY_LIGHT:
                              'black'}
                      name='dots-horizontal' 
                      type='material-community'
                      underlayColor='transparent'
                      onPress={() => this.loadExtraSuggestions()}>
        </ElementsIcon>
      </TouchableHighlight>
    </View>)
  }

  renderSuggestions = () => {

    return (<View style={[this.state.sbStyle]}> 
            
            {(this.state.suggestionsForRendering.length==0) ?

              this.noSuggestionsPlaceholder() :

              this.renderSuggestionBar()
            }

          </View>);
  }

  renderHeader = () => {

    return (
      <Header center={<Title style={[styles.Title]}>{this.state.theirName}</Title>}/>
    )
  }

  renderFooter = () => {

    return (
      <Footer left={(this.state.footerLeftIcon=='composer') ?
                      this.composerBarIcon() :
                      this.displayMessageIcon()
                    }

              center={<MessageInput ref='mi' 
                                    onChangeText={(value) => this.textChanged(value, false)}
                                    placeholder={Texts.inputPlaceholder[this.state.defaultLang]}>
                      </MessageInput>}

              right={<ToolbarButton style={this.state.sendStyle} 
                                    name='md-send' 
                                    onPress={() => this.sendMessage()}/>}/>)
  }

  renderConversationWindow = () => {

    return (
      <Container ref="container" style={[styles.Container]}>

          {this.renderHeader()}
          <ChatWindow ref="cw">          
            <ListView dataSource={this.state.dataSource}
                      enableEmptySections={true}
                      renderRow={(rowData) => this.renderRow(rowData)}/>
            {this.renderTypingIndicator()}
          </ChatWindow>

          { (this.state.selectionsVisible) ? 

          <View style={{height: 35, flexDirection: 'row'}}>
            { (this.state.footerLeftIcon == 'message') ?
              this.renderComposerBar() :
              this.renderPotentialMessage()
            }        
            <View style={[styles.minimizeToolbarContainer]}>
              <TouchableHighlight style={[styles.toolbarButton]}>
                <ElementsIcon color={SECONDARY}
                              name='window-minimize' 
                              type='material-community'
                              underlayColor='transparent'
                              onPress={() => {this.setState({selectionsVisible: false})}}>
                </ElementsIcon>
              </TouchableHighlight>
            </View> 
          </View> : null
          }

          {this.renderFooter()}
          
          {this.renderSuggestions()}
          
      </Container>
   );
  }

  composerBarIcon = () => {

    return (

      <TouchableHighlight style={[styles.toolbarButton]}>
        <ElementsIcon color={(this.state.selections.length>0) ? 
                               SECONDARY : 'black'}
                      name='list' 
                      type='material'
                      underlayColor='transparent'
                      onPress={() => this.handleFooterLeftIcon('message')}>
        </ElementsIcon>
      </TouchableHighlight>
    )    
  }

  displayMessageIcon = () => {

    return (

      <TouchableHighlight style={[styles.toolbarButton]}>
        <ElementsIcon color={(this.state.message.length>0) ? 
                               SECONDARY : 'black'}
                      name='thought-bubble' 
                      type='material-community'
                      underlayColor='transparent'
                      onPress={() => this.handleFooterLeftIcon('composer')}>
        </ElementsIcon>
      </TouchableHighlight>
    )
  }

  handleFooterLeftIcon = (icon) => {

    if (this.state.selections.length==0) return;
    this.setState({footerLeftIcon: icon,
                   selectionsVisible: true})
  }

  render() {

     if (this.state.loading)
      return this.renderLoadingIndicator()
    
     else if (!!this.state.conversation)
      return this.renderConversationWindow()
    
     else 
      return this.noConversationsPlaceholder()

  }
}
