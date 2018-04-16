import React, { Component } from 'react';
import {
    Text,
    View,
} from 'native-base';
import {
    ScrollView,
    Dimensions 
} from 'react-native';

import SuggestionButton from './../suggestionButton/SuggestionButton.js';

import styles from './styles.js';

const windowWidth = Dimensions.get('window').width;

export default class SuggestionBar extends Component {

  constructor(props)  {
    super(props);
    this.state = {viewStyle: [styles.withoutKeyboard]
                 };
  }

  onKeyboardShow()  {
    this.setState({viewStyle: [styles.withKeyboard]});
  }

  onKeyboardHide()  {
    this.setState({viewStyle: [styles.withoutKeyboard]});
  }

  scrollToBeginning() {

    this.refs.sw.scrollTo({x: 0, y: 0, animated: false});
  }

  render = () => {

    return (
        <View>
          <ScrollView contentContainerStyle={[this.state.viewStyle, this.props.style]} 
                      horizontal 
                      showsHorizontalScrollIndicator = {true}
                      keyboardShouldPersistTaps = 'always'
                      ref='sw'>            
            {this.props.children}
          </ScrollView> 
        </View>
    );
  }
}