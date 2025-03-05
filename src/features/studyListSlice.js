import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAllStudyGroups, getStudyGroupHashtags, searchStudyGroups, getMyStudyGroups, deleteStudyGroup } from '../api/studyListApi'

// 모든 스터디 그룹 목록 조회
export const fetchAllStudyGroupsThunk = createAsyncThunk('studyList/fetchAll', async (_, { rejectWithValue }) => {
   try {
      const response = await getAllStudyGroups()
      return response.data.studygroups
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '스터디 그룹 목록 조회 실패')
   }
})

// 특정 스터디 그룹의 해시태그 조회
export const fetchStudyGroupHashtagsThunk = createAsyncThunk('studyList/fetchHashtags', async (studyId, { rejectWithValue }) => {
   try {
      const response = await getStudyGroupHashtags(studyId)
      return { studyId, hashtags: response.data.hashtags }
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '스터디 그룹 해시태그 조회 실패')
   }
})

// 스터디 그룹 검색
export const searchStudyGroupsThunk = createAsyncThunk('studyList/search', async ({ searchType, searchTerm }, { rejectWithValue }) => {
   try {
      const response = await searchStudyGroups(searchType, searchTerm)
      return response.data.studygroups
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '스터디 그룹 검색 실패')
   }
})

// 내가 참여한 스터디 그룹 목록 조회
export const fetchMyStudyGroupsThunk = createAsyncThunk('studyList/fetchMy', async (_, { rejectWithValue }) => {
   try {
      const response = await getMyStudyGroups()
      return response.data.myStudygroups
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '내 스터디 그룹 목록 조회 실패')
   }
})

// 스터디 그룹 삭제 (관리자 전용)
export const deleteStudyGroupThunk = createAsyncThunk('studyList/delete', async (studyId, { rejectWithValue }) => {
   try {
      await deleteStudyGroup(studyId)
      return studyId
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '스터디 그룹 삭제 실패')
   }
})

// 슬라이스 생성
const studyListSlice = createSlice({
   name: 'studyList',
   initialState: {
      studyGroups: [], // 모든 스터디 그룹 목록
      myStudyGroups: [], // 내가 참여한 스터디 그룹 목록
      searchResults: [], // 검색 결과
      hashtags: {}, // 스터디 그룹 ID를 키로 하는 해시태그 객체
      loading: false,
      error: null,
   },
   reducers: {
      // 검색 결과 초기화
      clearSearchResults: (state) => {
         state.searchResults = []
      },
   },
   extraReducers: (builder) => {
      // 모든 스터디 그룹 목록 조회
      builder
         .addCase(fetchAllStudyGroupsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchAllStudyGroupsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.studyGroups = action.payload
         })
         .addCase(fetchAllStudyGroupsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 특정 스터디 그룹의 해시태그 조회
         .addCase(fetchStudyGroupHashtagsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchStudyGroupHashtagsThunk.fulfilled, (state, action) => {
            state.loading = false
            // 스터디 그룹 ID를 키로 사용하여 해시태그 저장
            state.hashtags[action.payload.studyId] = action.payload.hashtags
         })
         .addCase(fetchStudyGroupHashtagsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 스터디 그룹 검색
         .addCase(searchStudyGroupsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(searchStudyGroupsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.searchResults = action.payload
         })
         .addCase(searchStudyGroupsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 내가 참여한 스터디 그룹 목록 조회
         .addCase(fetchMyStudyGroupsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchMyStudyGroupsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.myStudyGroups = action.payload
         })
         .addCase(fetchMyStudyGroupsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 스터디 그룹 삭제 (관리자 전용)
         .addCase(deleteStudyGroupThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteStudyGroupThunk.fulfilled, (state, action) => {
            state.loading = false
            // 삭제된 스터디 그룹을 목록에서 제거
            state.studyGroups = state.studyGroups.filter((group) => group.id !== action.payload)
            state.myStudyGroups = state.myStudyGroups.filter((group) => group.id !== action.payload)
            state.searchResults = state.searchResults.filter((group) => group.id !== action.payload)
            // 해시태그 정보도 제거
            delete state.hashtags[action.payload]
            alert('스터디 그룹이 성공적으로 삭제되었습니다.')
         })
         .addCase(deleteStudyGroupThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            alert(action.payload || '스터디 그룹 삭제 실패')
         })
   },
})

export const { clearSearchResults } = studyListSlice.actions
export default studyListSlice.reducer
