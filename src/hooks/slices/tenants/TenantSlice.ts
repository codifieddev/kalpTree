import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Website } from "@/components/admin/AppShell";

interface TenantState {
  tenants: any[];
  currentTenants: any | null;
}

const initialState: TenantState = {
  tenants: [],
  currentTenants: null,
};

const tenantsSlice = createSlice({
  name: "websites",
  initialState,
  reducers: {
    setTenants(state, action: PayloadAction<any[]>) {
      state.tenants = action.payload;
      // If currentWebsite is not set, pick the first one
      if (!state.currentTenants && action.payload.length > 0) {
        state.currentTenants = action.payload[0];
      }
    },
    clearTenants(state) {
      state.tenants = [];
      state.currentTenants = null;
    },
    setCurrentTenants(state, action: PayloadAction<any | null>) {
      state.currentTenants = action.payload;
    },
  },
});

export const { setTenants, clearTenants, setCurrentTenants } = tenantsSlice.actions;
export default tenantsSlice.reducer;
