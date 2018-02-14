import { StyleSheet,
         Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

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
  modalContainer: {
    flex: 1,
    backgroundColor: SECONDARY,
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
  }
});