import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchReports, fetchBannedUsers, reportUser, banUser, unbanUser } from '../api/bannedApi'

// ✅ 신고 목록 가져오기 (비동기 요청)
export const getReports = createAsyncThunk('banned/getReports', async (_, { rejectWithValue }) => {
   try {
      return await fetchReports()
   } catch (error) {
      return rejectWithValue(error)
   }
})

// ✅ 신고하기
export const submitReport = createAsyncThunk('banned/submitReport', async ({ reportedUserId, reporterId, reason }, { rejectWithValue }) => {
   try {
      return await reportUser(reportedUserId, reporterId, reason)
   } catch (error) {
      return rejectWithValue(error)
   }
})

// ✅ 벤 목록 가져오기
export const getBannedUsers = createAsyncThunk('banned/getBannedUsers', async (_, { rejectWithValue }) => {
   try {
      return await fetchBannedUsers()
   } catch (error) {
      return rejectWithValue(error)
   }
})

// ✅ 벤 적용하기
export const applyBan = createAsyncThunk('banned/applyBan', async ({ reportId, adminId, banDays }, { rejectWithValue }) => {
   try {
      return await banUser(reportId, adminId, banDays)
   } catch (error) {
      return rejectWithValue(error)
   }
})

// ✅ 벤 해제하기
export const removeBan = createAsyncThunk('banned/removeBan', async (userId, { rejectWithValue }) => {
   try {
      return await unbanUser(userId)
   } catch (error) {
      return rejectWithValue(error)
   }
})

const bannedSlice = createSlice({
   name: 'banned',
   initialState: {
      reports: [],
      bannedUsers: [],
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         // 신고 목록 불러오기
         .addCase(getReports.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getReports.fulfilled, (state, action) => {
            state.loading = false
            state.reports = action.payload
         })
         .addCase(getReports.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 벤 목록 불러오기
         .addCase(getBannedUsers.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getBannedUsers.fulfilled, (state, action) => {
            state.loading = false
            state.bannedUsers = action.payload
         })
         .addCase(getBannedUsers.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 신고 제출
         .addCase(submitReport.pending, (state) => {
            state.loading = true
         })
         .addCase(submitReport.fulfilled, (state, action) => {
            state.loading = false
            state.reports.push(action.payload)
         })
         .addCase(submitReport.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 벤 적용
         .addCase(applyBan.pending, (state) => {
            state.loading = true
         })
         .addCase(applyBan.fulfilled, (state, action) => {
            state.loading = false
            state.bannedUsers.push(action.payload)
            state.reports = state.reports.filter((r) => r.id !== action.payload.reportId) // ✅ 신고에서 삭제
         })
         .addCase(applyBan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 벤 해제
         .addCase(removeBan.pending, (state) => {
            state.loading = true
         })
         .addCase(removeBan.fulfilled, (state, action) => {
            state.loading = false
            state.bannedUsers = state.bannedUsers.filter((b) => b.userId !== action.payload.userId)
         })
         .addCase(removeBan.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default bannedSlice.reducer
