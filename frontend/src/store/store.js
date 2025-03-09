import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './messageSlice';

const store = configureStore({
    reducer: {
        messages: messageReducer,
    },
});

export default store;


