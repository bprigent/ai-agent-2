import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// send message to backend on /api/v1/chat
export const sendMessage = createAsyncThunk(
    'messages/sendMessage', 
    async (message, { dispatch }) => {
        try {
            // First, add the user's message
            const userMessage = {
                id: Date.now(),
                date: new Date().toISOString(),
                sender: 'user',
                type: 'text',
                content: {
                    text: message,
                },
            };

            // Add user message to Redux store
            dispatch(addMessage(userMessage));

            // Send message to backend
            const response = await fetch('http://localhost:8000/api/v1/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({message: message}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Get response from backend
            const backendResponse = await response.json();
            
            // return data and add to Redux store
            return backendResponse;

        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
);
            



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
    extraReducers: (builder) => {
        builder.addCase(sendMessage.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(sendMessage.fulfilled, (state, action) => { 
            state.isLoading = false;
            state.messages.push(action.payload);
        });
        builder.addCase(sendMessage.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message; 
        });
    },
});

export const { addMessage, setLoading, setError, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;

/*
// example of messages in the store
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

*/