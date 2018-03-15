import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, TextInput, TouchableOpacity, Text, Image } from 'react-native';

import { SegmentedControls } from 'react-native-radio-buttons'

import translations from '../../i18n';

import InputWindow from '../inputWindow/InputWindow.js';
import Lists from "../../Lists.js";

import styles from './Styles';
import { PRIMARY_DARK} from "../../masterStyle.js"


class BasicFormComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { register: this.props.register,
                   email: '', 
                   password: '',
                   name: '',
                   age: '',
                   language: Lists.languages[0],
                   gender: Lists.genders[0] };

    this.handleEmailChange = (email) => {
      this.setState({email: email});
    };

    this.handlePasswordChange = (password) => {
      this.setState({password: password});
    };

    this.handleNameChange = (name) => {
      this.setState({name: name});
    };

    this.handleAgeChange = (age) => {
      this.setState({age: age});
    };

    this.setSelectedLanguage = (selectedOption) => {
      this.setState({language:selectedOption});
    }

    this.setSelectedGender = (selectedOption) => {
      this.setState({gender:selectedOption});
    }

    this.handleButtonPress = () => {
      if (!this.state.register) this.props.onButtonPress(this.state.email, this.state.password);
      else {
        if (this.state.name=="" || this.state.age=="")  return Alert.alert("Error", "You didn't complete the form!");
        this.props.onButtonPress(this.state.email, 
                                 this.state.password, 
                                 this.state.name, 
                                 this.state.age, 
                                 this.state.language, 
                                 this.state.gender);
      }
    };
  }

  listItems (items) {

    var pickerItems = [], i=0;
    for (i; i<items.length; i++) {
      pickerItems.push(<Item key={i} label={items[i].label} value={items[i].value}/>);
    }
    return pickerItems;
  }

  render() {
    return (
      <InputWindow
        contentContainerStyle={styles.Container}>

        {!this.state.register && <Image style={styles.logo}
               source={{uri: "https://firebasestorage.googleapis.com/v0/b/qutr-8cc2c.appspot.com/o/logo.png?alt=media&token=d9844d2c-51b4-43a2-a607-a4a7c1f2c5a6"}}/>}

        <TextInput
          style={styles.textInput}
          placeholder={translations.t('email')}
          returnKeyType='next'
          keyboardType='email-address'
          autoCapitalize='none'
          onChangeText={this.handleEmailChange}
          value={this.state.email}
          underlineColorAndroid={'transparent'} />

        <TextInput
          style={styles.textInput}
          placeholder={translations.t('password')}
          secureTextEntry={true}
          returnKeyType='next'
          onChangeText={this.handlePasswordChange}
          value={this.state.password}
          underlineColorAndroid={'transparent'} />

          {this.state.register && <TextInput
          style={ styles.textInput }
          placeholder="Name"
          returnKeyType='next'
          autoCapitalize='none'
          onChangeText={this.handleNameChange}
          value={this.state.name}
          underlineColorAndroid={'transparent'} />}

          {this.state.register && <TextInput
          style={ styles.textInput }
          placeholder="Age"
          returnKeyType='next'
          keyboardType='numeric'
          autoCapitalize='none'
          onChangeText={this.handleAgeChange}
          value={this.state.age}
          underlineColorAndroid={'transparent'} />}

          {this.state.register && <SegmentedControls
            options={ Lists.languages }
            tint={PRIMARY_DARK}
            onSelection={ this.setSelectedLanguage.bind(this) }
            selectedOption={ this.state.language }
            containerStyle={ styles.textInput }/>}

          {this.state.register && <SegmentedControls
            options={ Lists.genders }
            tint={PRIMARY_DARK}
            onSelection={ this.setSelectedGender.bind(this) }
            selectedOption={ this.state.gender }
            containerStyle={ styles.textInput }/>}

        <TouchableOpacity
          style={styles.button}
          onPress={this.handleButtonPress}>

          <Text style={styles.buttonTitle}>{this.props.buttonTitle}</Text>

        </TouchableOpacity>

      </InputWindow>
    );
  }
}

BasicFormComponent.propTypes = {
  buttonTitle: PropTypes.string.isRequired,
  onButtonPress: PropTypes.func.isRequired,
};

export default BasicFormComponent;
