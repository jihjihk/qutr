import React from 'react';
import PropTypes from 'prop-types';

import styles from './Styles';

import ToolbarButton from "../toolbarButton/ToolbarButton.js"

const LogoutButtonComponent = props =>
  <ToolbarButton onPress={props.logout}
  				 name="md-exit">

  </ToolbarButton>

LogoutButtonComponent.propTypes = {
  logout: PropTypes.func.isRequired
};

export default LogoutButtonComponent;
