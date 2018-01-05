import { StyleSheet } from 'react-native';

import {
  MYMESSAGEBG,
  MYMESSAGETEXT,
  THEIRMESSAGEBG,
  THEIRMESSAGETEXT,
} from '../../masterStyle.js';

export default StyleSheet.create({

  withoutKeyboard: {    
    flex: 1,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 0,
    justifyContent: 'flex-end',
  },
  withKeyboard: {
    maxHeight: 210,
    marginTop: 5,
    marginBottom: 5,
  },
  sw: {    
    flex: 1,
  },
  noHeight: {
    height: 0,
  },
  height: {
    height: 1,
    backgroundColor: 'transparent',
  },
  myMessage: {
    backgroundColor: MYMESSAGEBG,
    color: MYMESSAGETEXT,
  },
  theirMessage: {
    backgroundColor: THEIRMESSAGEBG,
    color: THEIRMESSAGETEXT,
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
  }
});