import { StyleSheet } from 'react-native';

import {
  PRIMARY,
  PRIMARY_DARK,
  PRIMARY_LIGHT,
  SECONDARY_DARK,
  SECONDARY_LIGHT,
  WHITE,
  BLACK,
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
  }
});