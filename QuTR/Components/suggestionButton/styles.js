import { StyleSheet,
         Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default StyleSheet.create({

  container: {
    backgroundColor: '#C7C7C7',
    height: 40,
    width: windowWidth/3,
    borderRightWidth: 0.2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
  	textAlign: 'center', 
    textAlignVertical: 'center', 	
  	color: 'black',
  	fontSize: 15,
  },
});