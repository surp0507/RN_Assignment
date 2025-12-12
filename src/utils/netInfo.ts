import NetInfo from '@react-native-community/netinfo';

export const isOnline = async () => {
    try {
        const state = await NetInfo.fetch();

        if (!state.isConnected) return false;

        // active probe

        const controller = new AbortController();

        const timeout = setTimeout(() => controller.abort(), 1500);

        await fetch('https://www.google.com/generate_204', {
            method: 'GET',

            signal: controller.signal,
        });

        clearTimeout(timeout);

        return true;
    } catch (e) {
        return false;
    }
};