import { StyleSheet } from 'react-native';

import {
  SECONDARY,
  SECONDARY_DARK
} from '../../masterStyle.js';

export default StyleSheet.create({

  Container: {
    backgroundColor: SECONDARY_DARK
  },
  Title: {
    color: SECONDARY,
  },
  noConversations: {
  	flex: 1, 
  	flexDirection: 'column', 
  	justifyContent: 'center', 
  	alignItems: 'center'}
});