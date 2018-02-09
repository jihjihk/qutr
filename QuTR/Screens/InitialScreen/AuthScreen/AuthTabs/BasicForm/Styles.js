import { StyleSheet } from 'react-native';
import { PRIMARY_DARK,
         SECONDARY_DARK } from "../../../../../masterStyle.js"

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  textInput: {
    backgroundColor: '#ffffff',
    height: 40,
    margin: 10,
    borderRadius: 5,
    padding: 3
  },
  button: {
    backgroundColor: PRIMARY_DARK,
    height: 40,
    margin: 10,
    borderRadius: 5,
    padding: 3,
    alignItems: 'center',
    justifyContent:'center'
  },
  buttonTitle: {
    color: SECONDARY_DARK,
    fontSize: 18,
    fontWeight: 'bold'
  },
  logo: {
    height: 150,
    width: 150,
    alignSelf: 'center',
    marginVertical: 30
  }
});
