import { configureStore } from '@reduxjs/toolkit';
import pageEditReducer from '../hooks/slices/pageEditSlice';
import userSlice from "../hooks/slices/user/userSlice"
export const store = configureStore({
  reducer: {
    user:userSlice,
    pageEdit: pageEditReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
