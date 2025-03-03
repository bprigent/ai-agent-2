import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: [],
    isLoading: false,
    error: null,
  };
  
const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearMessages: (state) => {
            state.messages = [];
        },
    },
});

export const { addMessage, setLoading, setError, clearMessages } = messageSlice.actions;
export default messageSlice.reducer;

