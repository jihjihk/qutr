import { StyleSheet,
         Dimensions
} from 'react-native';

import {
  SECONDARY_DARK,
  PRIMARY_DARK,
  SUGGESTIONBAR_HEIGHT
} from '../../masterStyle.js';

const windowHeight = Dimensions.get('window').height;


export default StyleSheet.create({

  container: {
    backgroundColor: SECONDARY_DARK,
    height: windowHeight/SUGGESTIONBAR_HEIGHT,
    borderRightWidth: 0.2,
    borderLeftWidth: 0.2,
    borderColor: PRIMARY_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5
  },
  text: {
  	textAlign: 'center', 
    textAlignVertical: 'center',
    justifyContent: 'center', 	
  	color: PRIMARY_DARK,
  	fontSize: 15,
  },
});