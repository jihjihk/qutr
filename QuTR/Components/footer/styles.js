import { StyleSheet } from 'react-native';

import {
  PRIMARY,
  BLACK,
  PRIMARY_DARK
} from '../../masterStyle.js';

export default StyleSheet.create({

  Footer: {
    backgroundColor: PRIMARY_DARK,
    flexDirection: 'row', 
    height: 45,
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