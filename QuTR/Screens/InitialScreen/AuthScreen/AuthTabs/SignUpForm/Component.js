import React from 'react';
import PropTypes from 'prop-types';

import BasicForm from '../../../../../Components/basicForm';

import translations from '../../../../../i18n';

const SignUpFormComponent = props =>
  <BasicForm
    buttonTitle={translations.t('signup')}
    onButtonPress={props.signup}
    register={true} />

SignUpFormComponent.propTypes = {
  signup: PropTypes.func.isRequired
};

export default SignUpFormComponent;
