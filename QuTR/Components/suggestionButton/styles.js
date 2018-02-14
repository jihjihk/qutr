import { StyleSheet,
         Dimensions } from 'react-native';

import {
  SECONDARY_DARK,
  PRIMARY_DARK
} from '../../masterStyle.js';


const windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({

  container: {
    backgroundColor: SECONDARY_DARK,
    height: 40,
    width: windowWidth/3,
    borderRightWidth: 0.2,
    borderColor: PRIMARY_DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
  	textAlign: 'center', 
    textAlignVertical: 'center', 	
  	color: PRIMARY_DARK,
  	fontSize: 15,
  },
});