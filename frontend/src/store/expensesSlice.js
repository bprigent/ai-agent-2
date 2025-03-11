import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching expenses
export const fetchExpenses = createAsyncThunk(
    'expenses/fetchExpenses',
    async () => {
        const response = await fetch('http://localhost:8000/api/v1/fetch-all-expenses');
        if (!response.ok) {
            throw new Error('Failed to fetch expenses');
        }
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        return data.expenses; // Extract the expenses array from the response
    }
);

const initialState = {
    items: [],
    status: 'idle',
    error: null
};

const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default expensesSlice.reducer; 
