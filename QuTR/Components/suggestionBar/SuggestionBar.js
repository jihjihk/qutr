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

const DEFAULTCOUNT = 3;

export default class SuggestionBar extends Component {

  constructor(props)  {
    super(props);
    this.state = {viewStyle: [styles.withoutKeyboard],
                  content: [],
                  suggestionCount: DEFAULTCOUNT
                };
  }

  onKeyboardShow()  {
    this.setState({viewStyle: [styles.withKeyboard]});
  }

  onKeyboardHide()  {
    this.setState({viewStyle: [styles.withoutKeyboard]});
  }

  populate(suggestions)  {
    
    if (suggestions.length>0) {

      var phrases=[];
      suggestions.forEach(function(child) {
        phrases.push(child.phrase);
      })

      this.setState({content: phrases,
                     suggestionCount: suggestions.length});
    }

    else this.clean();
  }

  clean()  {
    this.setState({content: [],
                   suggestionCount: DEFAULTCOUNT});
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