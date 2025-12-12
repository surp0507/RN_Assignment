import React, { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/store'
import AddFormDataScreen from "./src/Screens/AddFormDataScreen"
import GetFormDataScreen from "./src/Screens/GetFormDataScreen"
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import { isOnline } from './src/utils/netInfo';

const Stack = createNativeStackNavigator();

function App() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      const online = await isOnline();
      if (online) {
        setIsConnected(online);
        Toast.show({
          type: 'info',
          text1: online ? 'Online Mode' : 'Offline Mode',
          position: 'top',
          visibilityTime: 2000,
        });
      } else {
        Toast.show({
          type: 'info',
          text1: 'Offline Mode',
          position: 'top',
          visibilityTime: 2000,
        });
      }
    });
    (async () => {
      const online = await isOnline();
      setIsConnected(online);
    })();

    return () => unsubscribe();
  }, [isConnected]);

  return (
    <Provider store={store}>
      <NavigationContainer>

        <Stack.Navigator initialRouteName="AddFormDataScreen">
          <Stack.Screen
            name="AddFormDataScreen"
            component={AddFormDataScreen}
            options={{ title: 'Add Product' }}
          />
          <Stack.Screen
            name="GetFormDataScreen"
            component={GetFormDataScreen}
            options={{ title: 'Search Product' }}
          />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </Provider>
  );
}

export default App;



