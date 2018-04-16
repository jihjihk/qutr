import { StyleSheet, Dimensions } from 'react-native';

import {
  SECONDARY,
  SECONDARY_DARK,
  SECONDARY_LIGHT,
  PRIMARY,
  PRIMARY_DARK,
  PRIMARY_LIGHT,
  SUGGESTIONBAR_HEIGHT
} from '../../masterStyle.js';

const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({

  Container: {
    backgroundColor: SECONDARY_DARK,
  },
  withKeyboard: {
    height: windowHeight/SUGGESTIONBAR_HEIGHT,
  },
  withoutKeyboard: {
    height: 0,
  },
  Title: {
    color: SECONDARY,
  },
  myMessage: {
    backgroundColor: PRIMARY_LIGHT,
    color: SECONDARY_LIGHT,
  },
  theirMessage: {
    backgroundColor: PRIMARY_DARK,
    color: SECONDARY_DARK,
  },
  myMessageView: {
    alignSelf: 'flex-end', 
    flexDirection: 'row'
  },
  theirMessageView: {
    alignSelf: 'flex-start', 
    flexDirection: 'row'
  },
  picture: {
    borderRadius: 100, 
    borderWidth: 2, 
    width: 40, 
    height: 40, 
    alignSelf: 'center'
  },
  selectionList: {
    backgroundColor: 'transparent', 
    height: 35,
  },
  scrollWrapper: {
    height: 35, 
    borderColor: PRIMARY_DARK, 
    borderLeftWidth: 0.5,
    backgroundColor: PRIMARY,
    paddingHorizontal: 5,
    flexDirection: 'row',
    flex: 1
  },
  selectedSuggestion: {
    backgroundColor: SECONDARY, 
    borderRadius: 5, 
    color: PRIMARY, 
    fontSize: 17, 
    marginRight: 5
  },
  removeSelection: {
    color: 'red', 
    fontSize: 20, 
    alignSelf: 'center',
    marginRight: 5
  },
  noConversations: {
    flex: 1, 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  noSuggestionsContainer: {
    flex: 1, 
    justifyContent: 'center'
  },
  noSuggestionsText: {
    textAlign: 'center', 
    fontStyle: 'italic', 
    flex: 1, 
    textAlignVertical: 'center'
  },
  showMoreButton: {
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 60,  
  },
  toolbarButton: {
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1
  },
  activityIndicator: {
    flex: 1, 
    justifyContent:'center'
  },
  dotIndicator: {
    marginLeft: 5, 
    justifyContent: 'flex-start'
  },
  minimizeToolbarContainer: {
    width: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: PRIMARY, 
    alignSelf: 'flex-end'
  }
});