import React, { Component } from 'react';
import {
    Text,
    View,
} from 'native-base';
import {
    ScrollView
} from 'react-native';

import SuggestionButton from './../suggestionButton/SuggestionButton.js';

import styles from './styles.js';

export default class SuggestionBar extends Component {

  constructor(props)  {
    super(props);
    this.state = {viewStyle: [styles.withoutKeyboard],
                  content: [],
                  suggestionCount: 5
                };
  }

  onKeyboardShow()  {
    this.setState({viewStyle: [styles.withKeyboard]});
  }

  onKeyboardHide()  {
    this.setState({viewStyle: [styles.withoutKeyboard]});
  }

  populate(input)  {
    
    if (input!=='') {

      var suggestions = [];
      for (var i=0; i<this.state.suggestionCount; i++)  {
        var suffix = '';
        for (var a=0; a<i+1; a++) suffix = suffix.concat('.');
        suggestions.push(input+suffix);
      }

      this.setState({content: suggestions});
    }

    else this.clean();
  }

  clean()  {
    this.setState({content: []});
  }

  render = () => {

    var suggestions = [];
    for (var i=0; i<this.state.suggestionCount; i++)  {
      suggestions.push(<SuggestionButton key={i}
                                         text={this.state.content[i]} 
                                         toSelect ={(suggestion) => this.props.select(suggestion)}>
                       </SuggestionButton>);
    }

    return (
        <View>
          <ScrollView contentContainerStyle={[this.state.viewStyle, this.props.style]} 
                      horizontal 
                      showsHorizontalScrollIndicator = {false}
                      keyboardShouldPersistTaps = 'always'>            
            {suggestions}
          </ScrollView> 
        </View>
    );
  }
}