import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import AppNavigator from './AppNavigator';
import {
  createStackNavigator,
} from 'react-navigation';

export default class App extends React.Component {
  render() {
    StatusBar.setBarStyle('dark-content', true);
    return <AppNavigator />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
