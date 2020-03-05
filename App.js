import React from 'react';
import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { DefaultTheme,Provider as PaperProvider, Drawer, Avatar, withTheme } from 'react-native-paper';

import HomeScreen from './screens/HomeScreen'
import ControlPanel from './screens/ControlScreen';
import SettingsScreen from './screens/SettingsScreen';
import { LoginScreen } from './screens/LoginScreen';

const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: 'blue',
    accent: 'green',
    text: "blue",
    background: "#fff",
    contained: 'yellow'
  },
  dark: false
};

const AppNavigator = createStackNavigator({
  Login: {screen:LoginScreen, navigationOptions:{
    headerShown: false
  }},
  Control: {screen: ControlPanel, navigationOptions:{
    headerShown: false
  }},
  Home: {screen: HomeScreen},
  Settings: {screen:SettingsScreen},
  
});

const Navigation = createAppContainer(AppNavigator);

export default function App() {
  return(
    <PaperProvider theme={theme}>  
      <Navigation />
    </PaperProvider>
  )
}