import { StyleSheet,
         Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

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
    height: 100,
    width: 100,
    borderWidth: 1, 
    borderColor: 'black',
    flexDirection: 'row', 
    alignSelf: 'center',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  // imageWrapper: {
  //   flex: 0.33, 
  //   borderWidth: 1, 
  //   borderColor: 'black',
  //   alignItems: 'center', 
  //   justifyContent: 'center', 
  //   paddingBottom: 10
  // },
  profileImage: {
    width: 100, 
    height: 100,

  },
  form: {
    flex: 1, 
  },
  modalContainer: {
    flex: 1
  },
  loadMore: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    height: windowHeight/15
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
});