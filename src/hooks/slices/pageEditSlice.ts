import { PageModel } from '@/types/pages/PageModel';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PageEditState {
  page: PageModel|null;
}

const initialState: PageEditState = {
  page: null,
};

export const pageEditSlice = createSlice({
  name: 'pageEdit',
  initialState,
  reducers: {
    setPageEdit: (state, action) => {
      state.page = action.payload;
    },
    clearPageEdit: (state) => {
      state.page = null;
    },
  },
});

export const { setPageEdit, clearPageEdit } = pageEditSlice.actions;
export default pageEditSlice.reducer;
