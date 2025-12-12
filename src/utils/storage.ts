import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_FORMS = '@pending_forms';
const LAST_FETCHED = '@last_fetched_objects';

export interface PendingForm {
    [key: string]: any;
    savedAt?: string;
}

export async function savePendingForm(form: PendingForm): Promise<boolean> {
    try {
        const raw = await AsyncStorage.getItem(PENDING_FORMS);
        const arr: PendingForm[] = raw ? JSON.parse(raw) : [];
        arr.push({ ...form, savedAt: new Date().toISOString() });
        await AsyncStorage.setItem(PENDING_FORMS, JSON.stringify(arr));
        return true;
    } catch {
        return false;
    }
}

export async function getPendingForms(): Promise<PendingForm[]> {
    try {
        const raw = await AsyncStorage.getItem(PENDING_FORMS);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export async function saveLastFetched(objects: any[]): Promise<void> {
    try {
        await AsyncStorage.setItem(LAST_FETCHED, JSON.stringify(objects));
    } catch { }
}

export async function getLastFetched(): Promise<any[]> {
    try {
        const raw = await AsyncStorage.getItem(LAST_FETCHED);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}
