import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    userId: 0,
    parentURL: '',
    commissionRate: 0
}

export const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        setState: (state, action) => {
            state.userId = action.payload.userId
            state.parentURL = action.payload.parentURL
            state.commissionRate = action.payload.commissionRate
        }
    }
});
export const { setState } = authSlice.actions
export default authSlice.reducer