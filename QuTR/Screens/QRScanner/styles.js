import { StyleSheet } from 'react-native';

import {
  SECONDARY,
  SECONDARY_DARK
} from '../../masterStyle.js';

export default StyleSheet.create({
	Container: {
	    flex: 1,
	    alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: SECONDARY_DARK
	 },
	 Scanner: {
	 	width: 350, 
	 	height: 350, 
	 	alignSelf: 'center', 
	 	justifyContent: 'center' 
	 }
});