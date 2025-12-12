import React, { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/store'
import AddFormDataScreen from "./src/screens/AddFormDataScreen"
import GetFormDataScreen from "./src/screens/GetFormDataScreen"
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { isOnline } from './src/utils/netInfo';
import AppNavigator from './src/navigationContainerProvider';



function App() {

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

export default App;



