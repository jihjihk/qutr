import React from 'react';
import PropTypes from 'prop-types';

import BasicForm from '../../../../../Components/basicForm';

import translations from '../../../../../i18n';

const LoginFormComponent = props =>
  <BasicForm
    buttonTitle={translations.t('login')}
    onButtonPress={props.login} 
    register={false}/>

LoginFormComponent.propTypes = {
  login: PropTypes.func.isRequired
};

export default LoginFormComponent;
