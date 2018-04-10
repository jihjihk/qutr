import { StyleSheet,
		 Dimensions } from 'react-native';

import {
  SUGGESTIONBAR_HEIGHT
} from '../../masterStyle.js';

const windowHeight = Dimensions.get('window').height;

export default StyleSheet.create({

  withKeyboard: {
    height: windowHeight/SUGGESTIONBAR_HEIGHT,
  },
  withoutKeyboard: {
  	height: 0,
  }
});