import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toggleStudyLike, getStudyLikes, checkUserLikeStatus } from '../api/liked'

/**
 *  1. 스터디 그룹 좋아요 추가/취소 (토글)
 */
export const toggleStudyLikeThunk = createAsyncThunk('studyLike/toggle', async (groupId, { rejectWithValue }) => {
   try {
      const response = await toggleStudyLike(groupId) //  userId는 불필요 (백엔드에서 처리)
      return response //  서버 응답 반환 (좋아요 개수 + 상태)
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '좋아요 처리 실패')
   }
})

/**
 *  2. 특정 스터디 그룹의 좋아요 개수 가져오기
 */
export const fetchStudyLikesThunk = createAsyncThunk('studyLike/fetchLikes', async (groupId, { rejectWithValue }) => {
   try {
      const response = await getStudyLikes(groupId) // 🚨 API 함수에서 호출하는 엔드포인트 확인 필요
      return response.likeCount // ✅ `liked` → `likeCount`으로 변경
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '좋아요 개수 조회 실패')
   }
})

/**
 *  3. 사용자의 특정 스터디 그룹 좋아요 여부 확인
 */
export const checkUserLikeStatusThunk = createAsyncThunk('studyLike/checkStatus', async (groupId, { rejectWithValue }) => {
   try {
      const response = await checkUserLikeStatus(groupId)
      return response.isLiked //  서버에서 받은 좋아요 상태 (true / false)
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '좋아요 상태 조회 실패')
   }
})

// ✅ Redux Slice 생성
const studyLikeSlice = createSlice({
   name: 'studyLike',
   initialState: {
      likedCount: 0, //  좋아요 개수 저장
      isLiked: false, //  사용자가 좋아요를 눌렀는지 상태 저장
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      //  좋아요 추가/취소
      builder
         .addCase(toggleStudyLikeThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(toggleStudyLikeThunk.fulfilled, (state, action) => {
            state.loading = false
            state.likedCount = action.payload.liked //  업데이트된 좋아요 개수 반영
            state.isLiked = action.payload.isLiked //  서버 응답으로 받은 상태 반영
         })
         .addCase(toggleStudyLikeThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      //  특정 스터디 그룹의 좋아요 개수 조회
      builder
         .addCase(fetchStudyLikesThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchStudyLikesThunk.fulfilled, (state, action) => {
            state.loading = false
            state.likedCount = action.payload //  서버에서 받아온 좋아요 개수 저장
         })
         .addCase(fetchStudyLikesThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      //  사용자의 특정 스터디 그룹 좋아요 상태 조회
      builder
         .addCase(checkUserLikeStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(checkUserLikeStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isLiked = action.payload //  서버에서 받아온 좋아요 여부 저장
         })
         .addCase(checkUserLikeStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default studyLikeSlice.reducer
