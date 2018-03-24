import { StyleSheet,
      } from 'react-native';

import {
  SECONDARY_DARK,
  PRIMARY_DARK
} from '../../masterStyle.js';


export default StyleSheet.create({

  container: {
    backgroundColor: SECONDARY_DARK,
    height: 40,
    borderRightWidth: 0.2,
    borderColor: PRIMARY_DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
  	textAlign: 'center', 
    textAlignVertical: 'center',
    justifyContent: 'center', 	
  	color: PRIMARY_DARK,
  	fontSize: 15,
  },
});