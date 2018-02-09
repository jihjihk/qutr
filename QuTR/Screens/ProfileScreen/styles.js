import { StyleSheet,
         Dimensions } from 'react-native';

import {
  BLACK,
  SECONDARY,
  SECONDARY_LIGHT,
  PRIMARY,
  PRIMARY_DARK
} from '../../masterStyle.js';

export default StyleSheet.create({

  Container: {
    backgroundColor: SECONDARY
  },
  imageContainer: {
    height: 100,
    width: 100,
    borderWidth: 1, 
    borderColor: BLACK,
    flexDirection: 'row', 
    alignSelf: 'center',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  profileImage: {
    width: 100, 
    height: 100,
  },
  form: {
    flex: 1, 
  },
  confirm: {
    backgroundColor: PRIMARY_DARK,
    height: 40,
    margin: 10,
    borderRadius: 5,
    padding: 3,
    alignItems: 'center',
    justifyContent:'center'
  }
});