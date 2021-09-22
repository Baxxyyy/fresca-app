import 'react-native-gesture-handler';

import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Provider as PaperProvider } from 'react-native-paper';

import LoginScreen from './src/LoginScreen/LoginScreen';
import LoginBoxes from './src/LoginScreen/LoginBoxes';
import RegisterScreen from './src/LoginScreen/RegisterScreen';

import HomeScreen from './src/HomeScreen/HomeScreen';
import SplashScreen from './src/SplashScreen/SplashScreen';

import ManuelAddScreen from './src/AddScreen/Manuel/ManuelAddScreen';


import TodayScreen from './src/TodayScreen/TodayScreen';
import AllScreen from './src/AllScreen/AllScreen';

import SettingsScreen from './src/SettingsScreen/SettingsScreen';

const Stack = createStackNavigator();

function App() {

  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen 
          name="SplashScreen" 
          component={SplashScreen}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="loginBox"
          component={LoginBoxes}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="ManuelAddScreen"
          component={ManuelAddScreen}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="TodayScreen"
          component={TodayScreen}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="AllScreen"
          component={AllScreen}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{ headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}

export default App;