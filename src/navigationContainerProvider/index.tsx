import { NavigationContainer } from '@react-navigation/native';
import HomeStack from '../screens';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { getNetworkStatus, subscribeNetwork } from '../utils/netInfo';

export default function AppNavigator() {


    useEffect(() => {
        getNetworkStatus().then();
        const unsub = subscribeNetwork(status => {
            if (!status) {
                Toast.show({
                    type: 'error',
                    text1: 'You are offline',
                });
            } else {
                Toast.show({
                    type: 'success',
                    text1: 'Back online',
                });
            }
        });
        return unsub;
    }, []);

    return (
        <NavigationContainer>
            <HomeStack />
            <Toast />
        </NavigationContainer>
    );
}
