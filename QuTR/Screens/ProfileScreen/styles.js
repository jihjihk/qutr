import { StyleSheet,
         Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

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
  Title: {
    color: SECONDARY,
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
  modalContainer: {
    flex: 1,
    backgroundColor: SECONDARY,
  },
  loadMore: {
    backgroundColor: PRIMARY_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    height: windowHeight/15
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginLeft: 5
  },
  confirm: {
    backgroundColor: PRIMARY_DARK,
  }
});