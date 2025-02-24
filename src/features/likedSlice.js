//스터디그룹 좋아요 관련 슬라이스
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toggleStudyLike, getStudyLikes } from '../api/liked'

/**
 * ✅ 1. 스터디 그룹 좋아요 추가/취소 (토글)
 */
export const toggleStudyLikeThunk = createAsyncThunk('studyLike/toggle', async ({ groupId, userId }, { rejectWithValue }) => {
   try {
      const response = await toggleStudyLike(groupId, userId)
      return response // ✅ 서버 응답 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '좋아요 처리 실패')
   }
})

/**
 * ✅ 2. 특정 스터디 그룹의 좋아요 개수 가져오기
 */
export const fetchStudyLikesThunk = createAsyncThunk('studyLike/fetchLikes', async (groupId, { rejectWithValue }) => {
   try {
      const response = await getStudyLikes(groupId)
      return response.liked // ✅ 서버에서 받아온 좋아요 개수 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '좋아요 개수 조회 실패')
   }
})

// ✅ Redux Slice 생성
const studyLikeSlice = createSlice({
   name: 'studyLike',
   initialState: {
      likedCount: 0, // ✅ 좋아요 개수 저장
      isLiked: false, // ✅ 사용자가 좋아요를 눌렀는지 상태 저장 (필요할 경우)
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // ✅ 좋아요 추가/취소
      builder
         .addCase(toggleStudyLikeThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(toggleStudyLikeThunk.fulfilled, (state, action) => {
            state.loading = false
            state.likedCount = action.payload.liked // ✅ 업데이트된 좋아요 개수 반영
            state.isLiked = !state.isLiked // ✅ 사용자가 좋아요 상태 토글 (프론트에서 상태 변경 가능)
         })
         .addCase(toggleStudyLikeThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // ✅ 특정 스터디 그룹의 좋아요 개수 조회
      builder
         .addCase(fetchStudyLikesThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchStudyLikesThunk.fulfilled, (state, action) => {
            state.loading = false
            state.likedCount = action.payload // ✅ 서버에서 받아온 좋아요 개수 저장
         })
         .addCase(fetchStudyLikesThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default studyLikeSlice.reducer
