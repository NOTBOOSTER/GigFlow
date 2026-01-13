import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import gigReducer from './features/gigs/gigSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        gigs: gigReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
