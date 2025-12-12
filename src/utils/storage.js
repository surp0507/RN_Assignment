import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_FORMS = '@pending_forms';
const LAST_FETCHED = '@last_fetched_objects';

export async function savePendingForm(form) {
    try {
        const raw = await AsyncStorage.getItem(PENDING_FORMS);
        const arr = raw ? JSON.parse(raw) : [];
        arr.push({ ...form, savedAt: new Date().toISOString() });
        await AsyncStorage.setItem(PENDING_FORMS, JSON.stringify(arr));
        return true;
    } catch (e) {
        console.error('savePendingForm', e);
        return false;
    }
}

export async function getPendingForms() {
    try {
        const raw = await AsyncStorage.getItem(PENDING_FORMS);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

export async function saveLastFetched(objects) {
    console.log(objects, "objects")
    try {
        await AsyncStorage.setItem(LAST_FETCHED, JSON.stringify(objects));
    } catch (e) { }
}

export async function getLastFetched() {
    try {
        const raw = await AsyncStorage.getItem(LAST_FETCHED);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}