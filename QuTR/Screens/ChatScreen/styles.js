import { StyleSheet } from 'react-native';

import {
  SECONDARY,
  SECONDARY_DARK,
  SECONDARY_LIGHT,
  PRIMARY,
  PRIMARY_DARK,
  PRIMARY_LIGHT
} from '../../masterStyle.js';

export default StyleSheet.create({

  Container: {
    backgroundColor: SECONDARY_DARK
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
    flex: 1
  },
  childLayout: {
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5
  },
  badge: {
    position: 'absolute', 
    right: 5, 
    top: 2, 
    paddingTop: 0, 
    paddingBottom: 0, 
    borderRadius: 100, 
    height: 18, 
    alignItems: 'center'
  },
  badgeText: {
    height: 16, 
    fontSize: 10, 
    alignSelf: 'center'
  },
  scrollWrapper: {
    height: 35, 
    borderColor: PRIMARY_DARK, 
    borderWidth: 0.5, 
    backgroundColor: PRIMARY
  },
  selectedSuggestion: {
    backgroundColor: SECONDARY, 
    borderRadius: 5, 
    color: PRIMARY, 
    fontSize: 17, 
    marginRight: 5
  }
});