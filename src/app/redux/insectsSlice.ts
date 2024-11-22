import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Insect {
  _id: string;
  title: string;
  latinTitle: string;
  shortDescription: string;
  image: string;
  slug: string;
  class: string;
  order: string;
}

interface FiltersState {
  selectedClass: string | null;
  selectedOrders: string[];
}

interface InsectsState {
  allInsects: Insect[];
  visibleInsects: Insect[];
  filters: FiltersState;
  loading: boolean;
  hasMore: boolean;
}

const initialState: InsectsState = {
  allInsects: [],
  visibleInsects: [],
  filters: {
    selectedClass: null,
    selectedOrders: [],
  },
  loading: false,
  hasMore: true,
};

const insectsSlice = createSlice({
  name: "insects",
  initialState,
  reducers: {
    setAllInsects(state, action: PayloadAction<Insect[]>) {
      state.allInsects = action.payload;
    },
    addInsects(state, action: PayloadAction<Insect[]>) {
      state.allInsects = [...state.allInsects, ...action.payload];
    },
    setVisibleInsects(state, action: PayloadAction<Insect[]>) {
      state.visibleInsects = action.payload;
    },
    updateFilters(state, action: PayloadAction<FiltersState>) {
      state.filters = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setHasMore(state, action: PayloadAction<boolean>) {
      state.hasMore = action.payload;
    },
  },
});

export const {
  setAllInsects,
  addInsects,
  setVisibleInsects,
  updateFilters,
  setLoading,
  setHasMore,
} = insectsSlice.actions;

export default insectsSlice.reducer;
