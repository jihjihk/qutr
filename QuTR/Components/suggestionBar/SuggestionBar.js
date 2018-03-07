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
                  IDs: [],
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

      var phrases=[], IDs=[];
      suggestions.forEach(function(child) {
        phrases.push(child.phrase);
        IDs.push(child.ID);
      })

      this.setState({content: phrases,
                     IDs: IDs,
                     suggestionCount: suggestions.length});
    }

    else this.clean();
  }

  clean()  {
    this.setState({content: [],
                   IDs: [],
                   suggestionCount: DEFAULTCOUNT});
  }

  render = () => {

    var suggestions = [];
    for (var i=0; i<this.state.suggestionCount; i++)  {
      suggestions.push(<SuggestionButton key={i}
                                         text={this.state.content[i]} 
                                         id={this.state.IDs[i]}
                                         toSelect ={(suggestion, id) => this.props.select(suggestion, id)}>
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