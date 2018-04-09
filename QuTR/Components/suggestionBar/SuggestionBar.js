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

  populate(suggestions)  {
    
    // if (suggestions.length>0) {

    //   var phrases=[], IDs=[];
    //   suggestions.forEach((child) => {
    //     phrases.push(child.phrase);
    //     IDs.push(child.ID);
    //   })

    //   this.setState({content: phrases,
    //                  IDs: IDs,
    //                  suggestionCount: suggestions.length});
    // }

    // else this.clean();
  }

  clean()  {
    // this.setState({content: [],
    //                IDs: [],
    //                suggestionCount: DEFAULTCOUNT});
  }

  getSuggestionWidth = () => {

    // var widthDivisor = DEFAULTCOUNT;
    // if (this.state.suggestionCount == 1 || this.state.suggestionCount == 2 )
    //   widthDivisor = this.state.suggestionCount;
    // return {width: windowWidth/widthDivisor};
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

  // var suggestions = [];
  //   for (var i=0; i<this.state.suggestionCount; i++)  {
  //     suggestions.push(<SuggestionButton key={i}
  //                                        text={this.state.content[i]} 
  //                                        id={this.state.IDs[i]}
  //                                        toSelect ={(suggestion, id) => this.props.select(suggestion, id)}
  //                                        style = {this.getSuggestionWidth()}>
  //                      </SuggestionButton>);
  //   }
}