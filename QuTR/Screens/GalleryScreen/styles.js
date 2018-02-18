import { StyleSheet,
         Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

import {
  BLACK,
  SECONDARY,
  SECONDARY_DARK,
  PRIMARY,
  PRIMARY_DARK
} from '../../masterStyle.js';

export default StyleSheet.create({

  Container: {
    backgroundColor: SECONDARY_DARK
  },
  loadMore: {
    backgroundColor: PRIMARY_DARK,
    alignItems: 'center',
    justifyContent: 'center',
    height: windowHeight/15,
    width: windowWidth
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginLeft: 5,
    marginTop: 5
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});