import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../api/auth.api';
import type { User } from '../../types/user';

interface AuthState {
    currentUser: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
    loading: false,
    error: null,
};

export const register = createAsyncThunk(
    'auth/register',
    async (data: { name: string; email: string; password: string; role: 'client' | 'freelancer' }, { rejectWithValue }) => {
        try {
            const response = await authApi.register(data);
            return response;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Registration failed');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await authApi.login(data);
            return response;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Login failed');
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await authApi.logout();
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.currentUser = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                const payload = action.payload as any;
                const user = payload.user || payload;
                state.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                if (payload.token) {
                    localStorage.setItem('token', payload.token);
                }
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                const payload = action.payload as any;
                const user = payload.user || payload;
                state.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                if (payload.token) {
                    localStorage.setItem('token', payload.token);
                }
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logout.fulfilled, (state) => {
                state.currentUser = null;
                localStorage.removeItem('currentUser');
                localStorage.removeItem('token');
            });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;