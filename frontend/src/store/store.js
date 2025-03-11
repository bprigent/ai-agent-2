import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './messageSlice';
import expensesReducer from './expensesSlice';

const store = configureStore({
    reducer: {
        messages: messageReducer,
        expenses: expensesReducer,
    },
});

export default store;


