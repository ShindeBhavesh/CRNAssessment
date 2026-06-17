import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

interface UiState {
  mode: ThemeMode;
}

const initialState: UiState = {
  mode: "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    toggleMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setMode, toggleMode } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
