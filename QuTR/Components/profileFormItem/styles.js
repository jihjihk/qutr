import { StyleSheet } from 'react-native';

import {
  HEADERBG,
} from '../../masterStyle.js';

export default StyleSheet.create({

  formItem: {
    height: 60, 
    flex: 0.7, 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  formLabel: {
    flex: 0.35, 
    textAlign: 'right', 
    paddingRight: 15,
  },
  formTextInput: {
    height: 40, 
    flex: 0.65, 
    backgroundColor: HEADERBG,
    borderRadius: 10,
  }
});