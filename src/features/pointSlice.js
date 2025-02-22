import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUserPoints, usePointsForItem, sendPoints, getPointHistory } from '../api/pointApi'

// 포인트 조회
export const fetchUserPoints = createAsyncThunk('points/fetchUserPoints', async (_, { rejectWithValue }) => {
   try {
      const response = await getUserPoints()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '포인트 조회 실패')
   }
})

// 포인트 사용 (상품 구매)
export const pointsForItemThunk = createAsyncThunk('points/usePointsForItem', async (itemId, { rejectWithValue }) => {
   try {
      const response = await usePointsForItem(itemId)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '포인트 사용 실패')
   }
})

// 포인트 선물
export const sendPointsThunk = createAsyncThunk('points/sendPoints', async (data, { rejectWithValue }) => {
   try {
      const response = await sendPoints({
         receiverNickname: data.receiverNickname, // 닉네임으로 변경
         amount: data.amount,
      })
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '포인트 선물 실패')
   }
})

// 포인트 변동 내역 조회
export const fetchPointHistory = createAsyncThunk('points/fetchPointHistory', async (_, { rejectWithValue }) => {
   try {
      const response = await getPointHistory() // API 호출
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '포인트 변동 내역 조회 실패')
   }
})

const pointSlice = createSlice({
   name: 'points',
   initialState: {
      points: 0,
      history: [],
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 포인트 조회
      builder
         .addCase(fetchUserPoints.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchUserPoints.fulfilled, (state, action) => {
            state.loading = false
            state.points = action.payload.points || 0
         })
         .addCase(fetchUserPoints.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 포인트 사용
      builder
         .addCase(pointsForItemThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(pointsForItemThunk.fulfilled, (state, action) => {
            state.loading = false
            state.points = action.payload.remainingPoints
         })
         .addCase(pointsForItemThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 포인트 선물
      builder
         .addCase(sendPointsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(sendPointsThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(sendPointsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 포인트 변동 내역 조회
      builder
         .addCase(fetchPointHistory.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchPointHistory.fulfilled, (state, action) => {
            state.loading = false
            state.history = action.payload.history
         })
         .addCase(fetchPointHistory.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default pointSlice.reducer
