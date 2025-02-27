import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getTimeData, getAllTimeData } from '../api/timeApi'

export const fetchTimeData = createAsyncThunk('time/fetchTimeData', async (userId) => {
   const response = await getTimeData(userId)
   return response
})

export const fetchAllTimeData = createAsyncThunk('time/fetchAllTimeData', async (userId) => {
   const response = await getAllTimeData(userId)
   return response
})

const timeSlice = createSlice({
   name: 'time',
   initialState: {
      time: '00:00:00',
      YTime: '00:00:00',
      allTime: '00:00:00',
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchTimeData.pending, (state) => {
            state.loading = true
         })
         .addCase(fetchTimeData.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) {
               state.time = action.payload.time
               state.YTime = action.payload.YTime
            }
         })
         .addCase(fetchTimeData.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })
         .addCase(fetchAllTimeData.pending, (state) => {
            state.loading = true
         })
         .addCase(fetchAllTimeData.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload) {
               state.allTime = action.payload.allTime
            }
         })
         .addCase(fetchAllTimeData.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })
   },
})

export default timeSlice.reducer
