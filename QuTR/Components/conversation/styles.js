import { StyleSheet } from 'react-native';

import {
  PRIMARY,
  PRIMARY_LIGHT
} from '../../masterStyle.js';

export default StyleSheet.create({

  convo: {    
    height: 55,
    flex: 1,
    flexDirection: 'row',
  },
  TouchableHighlight: {
    borderBottomWidth: 1,
    borderColor: PRIMARY_LIGHT,
  },
  pictureWrapper: {
  	maxWidth: 80, 
  	maxHeight: 56, 
  	marginRight: 5, 
  	alignItems: 'center',
    justifyContent: 'center'
  },
  picture: {
  	borderRadius: 100, 
  	borderColor: PRIMARY, 
  	borderWidth: 0.5, 
  	height: 50, 
  	width: 50,
  },
  rowWrapper: {
  	padding: 5, 
  	flex: 1, 
  	flexDirection: 'row', 
  	justifyContent: 'flex-end', 
  	alignItems: 'center',
  },
  correspondent: {
  	fontSize: 16, 
  	fontWeight: 'bold', 
  	color: 'black', 
  	flex: 1
  },
  lastMessage: {
  	fontSize: 15, 
  	color: 'grey', 
  	flex: 1,
  },
  date: {
  	fontSize: 14, 
  	color: 'black', 
  	width: 80,
  },
  time: {
  	fontSize: 13, 
  	color: 'grey', 
  	width: 80,
  }
});