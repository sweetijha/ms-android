import React from 'react';
import {
    createStackNavigator
} from 'react-navigation';
import Login from './src/components/Login';
import Signup from './src/components/Signup';
import Forgot from './src/components/Forgot';
import Home from './src/components/Home';
import {StyleSheet, View, TextInput, Image, Text, Button, ScrollView} from 'react-native';
import { Icon } from 'react-native-elements';

const AppNavigator = createStackNavigator({

    Login: {
        screen : Login,
        navigationOptions: {
            header: null,
        }
    },
    Signup: {
        screen : Signup,
        navigationOptions: {
            header: null,
        }
    },
    Forgot: {
      screen : Forgot,
      navigationOptions: {
        header: null,
      }
    },
    Home: {
        screen : Home,
        navigationOptions: {
            header: null,
        }
    },
});



export default AppNavigator;
