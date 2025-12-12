import { NavigationContainer } from '@react-navigation/native';
import HomeStack from '../screens';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import { getNetworkStatus, subscribeNetwork } from '../utils/netInfo';

export default function AppNavigator() {
    const [online, setOnline] = useState(true);

    useEffect(() => {
        getNetworkStatus().then(setOnline);
        const unsub = subscribeNetwork(status => {
            setOnline(status);
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
