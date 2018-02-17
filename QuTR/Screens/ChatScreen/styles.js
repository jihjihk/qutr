import { StyleSheet } from 'react-native';

import {
  SECONDARY,
  SECONDARY_DARK,
  SECONDARY_LIGHT,
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
  }
});