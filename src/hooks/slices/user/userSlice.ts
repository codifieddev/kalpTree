import { IUser } from '@/models/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user:IUser| null,
  isSecondDashBoard:boolean
}

const initialState: UserState = {
  user: null,
  isSecondDashBoard:false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    updateUser(state, action: PayloadAction<Partial<UserState['user']>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateIsSecondDashBoard:(state,action)=>{
      state.isSecondDashBoard= action.payload    }
  },
});

export const { 
  setUser, 
  clearUser, 
  updateUser ,
updateIsSecondDashBoard} = userSlice.actions;
export default userSlice.reducer;
