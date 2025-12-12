import NetInfo from '@react-native-community/netinfo';

export const subscribeNetwork = (callback: (isConnected: boolean) => void) => {
    return NetInfo.addEventListener(state => {
        const status = state.isInternetReachable ?? state.isConnected;
        callback(!!status);
    });
};

export const getNetworkStatus = async (): Promise<boolean> => {
    const state = await NetInfo.fetch();
    return !!(state.isInternetReachable ?? state.isConnected);
};
