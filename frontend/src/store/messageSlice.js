import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: [
        {
            id: 1,
            date: '2025-03-07 12:00:00',
            sender: 'user',
            type: 'text',
            content: {
                text: 'Hello, how are you?',
            }   
        },
        {
            id: 2,
            date: '2025-03-08 12:01:00',
            sender: 'ai',
            type: 'text',
            content: {
                text: 'I am fine, thank you!',
            }
        },
        {
            id: 3,
            date: '2025-03-09 12:02:00',
            sender: 'ai',
            type: 'number',
            content: {
                value: 1000,
                metric: '$',
                label: 'Total Revenue',
            }
        },
        {
            id: 4,
            date: '2025-03-09 12:02:00',
            sender: 'ai',
            type: 'table',
            content: {
                headerList: ['Name', 'Age', 'Gender'],
                rowList: [
                    ['John', 25, 'Male'],
                    ['Jane', 30, 'Female'],
                    ['Jim', 35, 'Male'],
                ]
            }
        },
        {
            id: 5,
            date: '2025-03-09 17:02:00',
            sender: 'ai',
            type: 'pie_chart',
            content: {
                categoryList: ['Pasta', 'Pizza', 'Salad'],
                valueList: [324.4, 234.5, 123.4],
                metric: '$',
            }
        },
    ],
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

