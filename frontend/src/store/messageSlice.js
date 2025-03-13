import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

let socket = null;

// Initialize Socket.IO connection
const initializeSocketIO = (dispatch) => {
    if (socket === null) {
        // Create socket with auto-reconnection enabled
        socket = io('http://localhost:8000', {
            path: '/api/v1/socket.io/',  // Note the trailing slash
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 10000,
            transports: ['websocket', 'polling'],  // Try WebSocket first, then fall back to polling
        });
        
        // Connection events
        socket.on('connect', () => {
            console.log('Socket.IO connection established');
            dispatch(setError(null));
        });

        socket.on('disconnect', (reason) => {
            console.log(`Socket.IO disconnected: ${reason}`);
            if (reason === 'io server disconnect') {
                // The server has forcefully disconnected the socket
                socket.connect();
            }
        });

        socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error);
            dispatch(setError(`Connection error: ${error.message}`));
        });

        socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`Socket.IO reconnection attempt ${attemptNumber}`);
            dispatch(setError(`Reconnecting (attempt ${attemptNumber})...`));
        });

        socket.on('reconnect_failed', () => {
            console.error('Socket.IO reconnection failed');
            dispatch(setError('Failed to reconnect. Please refresh the page.'));
        });

        // Message handling
        socket.on('message', (data) => {
            const aiMessage = {
                id: Date.now(),
                date: new Date().toISOString(),
                sender: 'ai',
                ...data
            };
            dispatch(addMessage(aiMessage));
        });
    }
    return socket;
};

// send message using Socket.IO
export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async (message, { dispatch }) => {
        try {
            // Ensure Socket.IO is initialized
            const io = initializeSocketIO(dispatch);
            
            if (!io.connected) {
                throw new Error('Socket.IO is not connected');
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

            // Send message through Socket.IO
            io.emit('chat_message', { message: message });

            // Note: We don't return anything here because responses
            // will come through the Socket.IO event handlers
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
            // Close Socket.IO connection when clearing messages
            if (socket) {
                socket.disconnect();
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