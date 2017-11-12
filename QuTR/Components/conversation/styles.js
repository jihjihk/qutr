import { StyleSheet } from 'react-native';

import {

} from '../../masterStyle.js';

export default StyleSheet.create({

  convo: {    
    height: 55,
    flex: 1,
    flexDirection: 'row',
    marginBottom: 15,
  },
  pictureWrapper: {
  	maxWidth: 80, 
  	maxHeight: 56, 
  	marginRight: 5, 
  	alignItems: 'center',
  },
  picture: {
  	borderRadius: 100, 
  	borderColor: 'black', 
  	borderWidth: 2, 
  	height: 56, 
  	width: 56,
  },
  rowWrapper: {
  	padding: 5, 
  	flex: 1, 
  	flexDirection: 'row', 
  	justifyContent: 'flex-end', 
  	alignItems: 'center',
  },
  sender: {
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
  	fontSize: 13, 
  	color: 'black', 
  	width: 70,
  },
  time: {
  	fontSize: 11, 
  	color: 'grey', 
  	width: 70,
  }
});