import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthState: (state, action) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.user = action.payload.user;
        },
        clearAuthState: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { setAuthState, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
