import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getGrouptime, updateGrouptime, handleCaptchaFail, getTotalStudyTime } from '../api/grouptimeApi'

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

// 추가: 총 학습 시간 조회
export const fetchTotalStudyTimeThunk = createAsyncThunk('grouptime/fetchTotalTime', async (_, { rejectWithValue }) => {
   try {
      const response = await getTotalStudyTime()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '총 학습 시간 조회 실패')
   }
})

const grouptimeSlice = createSlice({
   name: 'grouptime',
   initialState: {
      grouptime: null,
      currentTime: 0,
      formattedTime: '00:00:00',
      totalTime: '00:00:00', // 추가: 사용자의 총 학습 시간
      loading: false,
      error: null,
   },
   reducers: {
      updateCurrentTime: (state, action) => {
         state.currentTime = action.payload.seconds
         state.formattedTime = action.payload.formatted
      },
   },
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

            // 초기 시간 설정
            if (action.payload.grouptime && action.payload.grouptime.time) {
               const timeParts = action.payload.grouptime.time.split(':')
               const totalSeconds = parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2])
               state.currentTime = totalSeconds
               state.formattedTime = action.payload.grouptime.time
            }
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

            // 서버에서 총 학습 시간 반환 시 업데이트
            if (action.payload.totalTime) {
               state.totalTime = action.payload.totalTime
            }
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

         // 추가: 총 학습 시간 조회
         .addCase(fetchTotalStudyTimeThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchTotalStudyTimeThunk.fulfilled, (state, action) => {
            state.loading = false
            state.totalTime = action.payload.totalTime
         })
         .addCase(fetchTotalStudyTimeThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { updateCurrentTime } = grouptimeSlice.actions

export default grouptimeSlice.reducer
