import { StyleSheet } from 'react-native';

import {
  PRIMARY,
} from '../../masterStyle.js';

export default StyleSheet.create({

  formItem: {
    height: 60,  
    flexDirection: 'row', 
    alignItems: 'center',
  },
  formLabel: {
    flex: 0.35,
    textAlign: 'right', 
    paddingRight: 15,
    color: PRIMARY
  },
  formTextInput: {
    height: 40, 
    flex: 0.5, 
    backgroundColor: PRIMARY,
    borderRadius: 10,
  }
});