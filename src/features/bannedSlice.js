import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchReports, fetchBannedUsers, reportUser, banUser, unbanUser, updateBanPeriod } from '../api/bannedApi'

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
      await reportUser(reportedUserId, reporterId, reason)
      alert('✅ 신고가 접수되었습니다.')
      return
   } catch (error) {
      if (error.message === '이미 신고한 유저입니다.') {
         alert('🚨 이미 신고한 유저입니다!')
      } else if (error.message === '이미 정지된 유저는 신고할 수 없습니다.') {
         alert('🚨 이미 정지된 유저는 신고할 수 없습니다!')
      } else if (error.message === '자기 자신을 신고할 수 없습니다.') {
         alert('🚨 자기 자신을 신고할 수 없습니다!')
      } else {
         alert('❌ 신고 요청 실패.')
      }
      return rejectWithValue(error.message || '신고 요청 실패')
   }
})

// ✅ 벤 목록 가져오기
export const getBannedUsers = createAsyncThunk('banned/getBannedUsers', async (_, { rejectWithValue }) => {
   try {
      const response = await fetchBannedUsers()
      console.log('🚀 벤된 유저 목록:', response) // ✅ 디버깅용
      return response
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

// ✅ 정지 기간 변경하기
export const changeBanPeriod = createAsyncThunk('banned/changeBanPeriod', async ({ bannedId, newEndDate }, { rejectWithValue }) => {
   console.log('🚀 정지 기간 변경 요청:', { bannedId, newEndDate }) // ✅ 추가!

   try {
      const response = await updateBanPeriod(bannedId, newEndDate)
      return response
   } catch (error) {
      console.error('❌ 정지 기간 변경 실패:', error)
      if (error.response && error.response.status === 404) {
         alert(`🚨 해당 유저(${bannedId})의 정지 기록을 찾을 수 없습니다.`)
      }
      return rejectWithValue(error.response?.data || '정지 기간 변경 실패')
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
         // ✅ 신고 목록 불러오기 시 BANNED 회원 신고도 포함
         .addCase(getReports.fulfilled, (state, action) => {
            state.loading = false

            // 🚨 이미 정지된 회원의 신고도 남아 있도록 유지
            state.reports = action.payload.map((report) => ({
               ...report,
               isBanned: report.isBanned, // ✅ 추가된 isBanned 값 유지
            }))
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
            console.log('🚀 Redux 상태 업데이트 (bannedUsers):', action.payload) // ✅ 여기 추가
            state.bannedUsers = action.payload
         })

         .addCase(getBannedUsers.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         // 정지 기간 변경
         .addCase(changeBanPeriod.pending, (state) => {
            state.loading = true
         })
         .addCase(changeBanPeriod.fulfilled, (state, action) => {
            console.log('🚀 Redux State Updated (bannedUsers):', state.bannedUsers)
            console.log('🚀 업데이트된 유저 데이터:', action.payload)
            state.bannedUsers = state.bannedUsers.map((user) => (user.bannedId === action.payload.bannedId ? { ...user, endDate: action.payload.newEndDate } : user))
         })

         .addCase(changeBanPeriod.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 신고 제출
         .addCase(submitReport.pending, (state) => {
            state.loading = true
         })
         .addCase(submitReport.fulfilled, (state, action) => {
            state.reports.push(action.payload)
            state.error = null // ✅ 오류 초기화
         })
         .addCase(submitReport.rejected, (state, action) => {
            state.error = typeof action.payload === 'string' ? action.payload : '알 수 없는 오류 발생' // ✅ 문자열만 저장
         })
         // 벤 적용
         .addCase(applyBan.pending, (state) => {
            state.loading = true
         })
         .addCase(applyBan.fulfilled, (state, action) => {
            state.loading = false
            state.bannedUsers.push(action.payload)

            // 🔥 "신고된 회원"의 모든 신고를 삭제하지 말고 "특정 신고(reportId)만 삭제" 유지!
            state.reports = state.reports.filter((r) => r.id !== action.payload.reportId) // ✅ reportId만 삭제 유지
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
