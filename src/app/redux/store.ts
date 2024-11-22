import { configureStore } from '@reduxjs/toolkit';
import insectsReducer from './insectsSlice';

const store = configureStore({
  reducer: {
    insects: insectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
