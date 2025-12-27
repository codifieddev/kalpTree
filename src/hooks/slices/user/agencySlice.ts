import { IUser } from '@/models/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AgencyState {
  agencies: IUser[];
  hasfetched: boolean;
  isAgencyLoading: boolean;
  curretAgency: IUser | null;
}

const initialState: AgencyState = {
  agencies: [],
  hasfetched: false,
  isAgencyLoading: false,
  curretAgency: null,
};


const agencySlice = createSlice({
  name: 'agency',
  initialState,
  reducers: {
    setAgencies(state, action: PayloadAction<IUser[]>) {
      state.agencies = action.payload;
      state.hasfetched = true;
    },
    setAgencyLoading(state, action: PayloadAction<boolean>) {
      state.isAgencyLoading = action.payload;
    },
    setCurretAgency(state, action: PayloadAction<IUser | null>) {
      state.curretAgency = action.payload;
    },
    clearAgencies(state) {
      state.agencies = [];
      state.hasfetched = false;
      state.curretAgency = null;
    },
  },
});

export const { setAgencies, setAgencyLoading, setCurretAgency, clearAgencies } = agencySlice.actions;
export default agencySlice.reducer;
