import { StyleSheet } from 'react-native';

import {
  HEADERBG,
  TITLE
} from '../../masterStyle.js';

export default StyleSheet.create({

  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Title: {
    color: TITLE,
  },
  imageContainer: {
    height: 120, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  imageWrapper: {
    flex: 0.33, 
    borderBottomWidth: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingBottom: 10
  },
  profileImage: {
    borderRadius: 100, 
    borderWidth: 2, 
    width: 90, 
    height: 90
  },
  form: {
    flex: 1, 
  },
  /* formRow: {
    height: 60, 
    flexDirection: 'row', 
    alignSelf: 'center',
  },
  */
});