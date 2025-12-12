import React, { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/store'
import AddFormDataScreen from "./src/screens/AddFormDataScreen"
import GetFormDataScreen from "./src/screens/GetFormDataScreen"
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigationContainerProvider';



function App() {

  return (
    <Provider store={store}>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>

    </Provider>
  );
}

export default App;



