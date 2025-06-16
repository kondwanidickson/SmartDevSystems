import { configureStore } from '@reduxjs/toolkit';
import apiReducer from '../config/reducers';

const store = configureStore({
  reducer: {
    api: apiReducer,
  },
});

export default store;