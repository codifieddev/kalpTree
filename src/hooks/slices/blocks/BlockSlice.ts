import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BlockManagerModel } from "@/components/admin/blocksManager/types/BlockManagerModel";

// Thunk to add a block
export const addBlockAsync = createAsyncThunk<
  BlockManagerModel,
  Partial<BlockManagerModel>,
  { rejectValue: string }
>(
  "blocks/addBlockAsync",
  async (block, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(block),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return rejectWithValue(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data?.item || data;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Network error"
      );
    }
  }
);

export type BlockState = {
  listBlocks: BlockManagerModel[];
  isBlockLoading: boolean;
  hasFetched: boolean;
};

const initialState: BlockState = {
  listBlocks: [],
  isBlockLoading: false,
  hasFetched: false,
};

export const fetchBlocks = createAsyncThunk<
  BlockManagerModel[],
  void,
  { state: { blocks: BlockState }; rejectValue: string }
>(
  "blocks/fetchBlocks",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/blocks`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return rejectWithValue(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data?.items || [];
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Network error"
      );
    }
  },
  {
    condition: (_, { getState }) => {
      try {
        const state = getState() as { blocks: BlockState };
        return !state.blocks.isBlockLoading;
      } catch {
        return true;
      }
    },
  }
);

const blockSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    setBlocks(state, action: PayloadAction<BlockManagerModel[]>) {
      state.listBlocks = action.payload;
    },
    addBlock(state, action: PayloadAction<BlockManagerModel>) {
      state.listBlocks.push(action.payload);
    },
    updateBlock(state, action: PayloadAction<BlockManagerModel>) {
      const updated = action.payload;
      const idx = state.listBlocks.findIndex((b) => b._id === updated._id);
      if (idx !== -1) {
        state.listBlocks[idx] = {
          ...state.listBlocks[idx],
          ...updated,
        };
      }
    },
    removeBlock(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.listBlocks = state.listBlocks.filter((b) => b._id !== id);
    },
    clearBlocks(state) {
      state.listBlocks = [];
      state.hasFetched = false;
      state.isBlockLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlocks.pending, (state) => {
        state.isBlockLoading = true;
      })
      .addCase(
        fetchBlocks.fulfilled,
        (state, action: PayloadAction<BlockManagerModel[]>) => {
          if (action.payload && action.payload.length) {
            state.listBlocks = action.payload;
            state.hasFetched = true;
            state.isBlockLoading = false;
          }
        }
      )
      .addCase(fetchBlocks.rejected, (state) => {
        state.isBlockLoading = false;
      })
      .addCase(addBlockAsync.fulfilled, (state, action: PayloadAction<BlockManagerModel>) => {
        if (action.payload) {
          state.listBlocks.push(action.payload);
        }
      });
  },
});

export const {
  setBlocks,
  addBlock,
  updateBlock,
  removeBlock,
  clearBlocks,
} = blockSlice.actions;

export default blockSlice.reducer;