import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { gigApi } from '../../api/gig.api';
import type { Gig, CreateGigInput } from '../../types/gig';

interface GigState {
    gigs: Gig[];
    currentGig: Gig | null;
    loading: boolean;
    error: string | null;
}

const initialState: GigState = {
    gigs: [],
    currentGig: null,
    loading: false,
    error: null,
};

export const fetchGigs = createAsyncThunk(
    'gigs/fetchAll',
    async (search: string | undefined, { rejectWithValue }) => {
        try {
            const response = await gigApi.getAll(search);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch gigs');
        }
    }
);

export const fetchGigById = createAsyncThunk(
    'gigs/fetchOne',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await gigApi.getOne(id);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch gig');
        }
    }
);

export const createGig = createAsyncThunk(
    'gigs/create',
    async (data: CreateGigInput, { rejectWithValue }) => {
        try {
            const response = await gigApi.create(data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to create gig');
        }
    }
);

export const deleteGig = createAsyncThunk(
    'gigs/delete',
    async (id: string, { rejectWithValue }) => {
        try {
            await gigApi.delete(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to delete gig');
        }
    }
);

const gigSlice = createSlice({
    name: 'gigs',
    initialState,
    reducers: {
        clearCurrentGig: (state) => {
            state.currentGig = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGigs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGigs.fulfilled, (state, action: PayloadAction<Gig[]>) => {
                state.loading = false;
                state.gigs = action.payload;
            })
            .addCase(fetchGigs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchGigById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGigById.fulfilled, (state, action: PayloadAction<Gig>) => {
                state.loading = false;
                state.currentGig = action.payload;
            })
            .addCase(fetchGigById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createGig.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGig.fulfilled, (state, action: PayloadAction<Gig>) => {
                state.loading = false;
                state.gigs.push(action.payload);
            })
            .addCase(createGig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteGig.fulfilled, (state, action: PayloadAction<string>) => {
                state.gigs = state.gigs.filter((gig) => gig._id !== action.payload);
            });
    },
});

export const { clearCurrentGig, clearError } = gigSlice.actions;
export default gigSlice.reducer;
