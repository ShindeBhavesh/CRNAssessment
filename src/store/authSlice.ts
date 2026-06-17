import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loadAuthSession, saveAuthSession } from "@/lib/localStorage";
import type { AuthSession } from "@/types/models";

interface AuthState {
  session: AuthSession | null;
}

const initialState: AuthState = {
  session: loadAuthSession(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<AuthSession>) => {
      state.session = action.payload;
      saveAuthSession(action.payload);
    },
    clearSession: (state) => {
      state.session = null;
      saveAuthSession(null);
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
