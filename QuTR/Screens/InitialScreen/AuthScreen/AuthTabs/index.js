import { TabNavigator } from 'react-navigation';

import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { PRIMARY_DARK,
        SECONDARY_DARK } from "../../../../masterStyle.js"

const routeConfigs = {
  Login: {
    screen: LoginForm
  },
  SignUp: {
    screen: SignUpForm
  }
};

const tabBarOptions = {
  tabBarOptions: {
    activeTintColor: PRIMARY_DARK,
    inactiveTintColor: '#aaaaaa',
    showIcon: true,
    scrollEnabled: false,
    indicatorStyle: {
      display: 'none'
    },
    style: {
      backgroundColor: SECONDARY_DARK
    }
  },
  tabBarPosition: 'bottom'
}

export default TabNavigator(routeConfigs, tabBarOptions);
