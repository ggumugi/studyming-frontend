// features/grouptimeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getGrouptime, updateGrouptime, handleCaptchaFail } from '../api/grouptimeApi'

// 타이머 정보 조회
export const fetchGrouptimeThunk = createAsyncThunk('grouptime/fetch', async (groupId, { rejectWithValue }) => {
   try {
      const response = await getGrouptime(groupId)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '타이머 정보 조회 실패')
   }
})

// 타이머 정보 업데이트
export const updateGrouptimeThunk = createAsyncThunk('grouptime/update', async ({ groupId, time }, { rejectWithValue }) => {
   try {
      const response = await updateGrouptime(groupId, time)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '타이머 정보 업데이트 실패')
   }
})

// 캡차 실패 처리
export const captchaFailThunk = createAsyncThunk('grouptime/captchaFail', async (groupId, { rejectWithValue }) => {
   try {
      const response = await handleCaptchaFail(groupId)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '캡차 실패 처리 실패')
   }
})

const grouptimeSlice = createSlice({
   name: 'grouptime',
   initialState: {
      grouptime: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 타이머 정보 조회
         .addCase(fetchGrouptimeThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchGrouptimeThunk.fulfilled, (state, action) => {
            state.loading = false
            state.grouptime = action.payload.grouptime
         })
         .addCase(fetchGrouptimeThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 타이머 정보 업데이트
         .addCase(updateGrouptimeThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateGrouptimeThunk.fulfilled, (state, action) => {
            state.loading = false
            state.grouptime = action.payload.grouptime
         })
         .addCase(updateGrouptimeThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 캡차 실패 처리
         .addCase(captchaFailThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(captchaFailThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(captchaFailThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default grouptimeSlice.reducer
