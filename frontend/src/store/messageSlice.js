import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

let socket = null;

// Initialize WebSocket connection
const initializeWebSocket = (dispatch) => {
    if (socket === null) {
        socket = new WebSocket('ws://localhost:8000/api/v1/chat');
        
        socket.onopen = () => {
            console.log('WebSocket connection established');
            dispatch(setError(null));
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
            socket = null;
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            dispatch(setError('WebSocket connection error'));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const aiMessage = {
                id: Date.now(),
                date: new Date().toISOString(),
                sender: 'ai',
                ...data
            };
            dispatch(addMessage(aiMessage));
        };
    }
    return socket;
};

// send message using WebSocket
export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async (message, { dispatch }) => {
        try {
            // Ensure WebSocket is initialized
            const ws = initializeWebSocket(dispatch);
            
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                throw new Error('WebSocket is not connected');
            }

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

            // Send message through WebSocket
            ws.send(JSON.stringify({ message: message }));

            // Note: We don't return anything here because responses
            // will come through the WebSocket onmessage handler
            return null;

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
            // Close WebSocket connection when clearing messages
            if (socket) {
                socket.close();
                socket = null;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(sendMessage.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(sendMessage.fulfilled, (state) => {
            state.isLoading = false;
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