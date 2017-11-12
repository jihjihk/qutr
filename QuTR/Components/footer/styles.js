import { StyleSheet } from 'react-native';

import {
  HEADERBG,
  TITLE
} from '../../masterStyle.js';

export default StyleSheet.create({

  Footer: {
    backgroundColor: HEADERBG,
    flexDirection: 'row', 
    height: 45,
    borderBottomWidth: 0.2,
    borderColor: 'white',
  },
  Side: {
    flex: 1,
    alignItems: 'center',
  },
  Body: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'stretch',
  }
});