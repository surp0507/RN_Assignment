import { configureStore } from '@reduxjs/toolkit';
import objectsReducer from './slices';

export const store = configureStore({
    reducer: {
        objects: objectsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
