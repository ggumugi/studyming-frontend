import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createStudygroup, getStudygroups, getStudygroupById, updateStudygroup, deleteStudygroup } from '../api/studygroupApi'

// 스터디 그룹 목록 가져오기
export const fetchStudygroupsThunk = createAsyncThunk('studygroups/fetchAll', async (_, { rejectWithValue }) => {
   try {
      const response = await getStudygroups()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '스터디 그룹 목록 불러오기 실패')
   }
})

// 스터디 그룹 생성
export const createStudygroupThunk = createAsyncThunk('studygroups/create', async (studygroupData, { rejectWithValue }) => {
   try {
      const response = await createStudygroup(studygroupData)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '스터디 그룹 생성 실패')
   }
})

// 특정 스터디 그룹 가져오기
export const fetchStudygroupByIdThunk = createAsyncThunk('studygroups/fetchStudygroupById', async (id, { rejectWithValue }) => {
   try {
      const response = await getStudygroupById(id)
      console.log('📢 API 응답 데이터:', response.data) // 🔥 응답 데이터 확인
      return {
         id: response.data.studygroup.id,
         hashtags: response.data.studygroup.Hashtaged || [], // ✅ Hashtaged를 Redux에 저장
      }
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '스터디 그룹 불러오기 실패')
   }
})

// 스터디 그룹 업데이트
export const updateStudygroupThunk = createAsyncThunk('studygroups/update', async ({ id, updateData }, { rejectWithValue }) => {
   try {
      const response = await updateStudygroup(id, updateData)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '스터디 그룹 업데이트 실패')
   }
})

// 스터디 그룹 삭제
export const deleteStudygroupThunk = createAsyncThunk('studygroups/delete', async (id, { rejectWithValue }) => {
   try {
      await deleteStudygroup(id)
      return id // 삭제된 ID를 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '스터디 그룹 삭제 실패')
   }
})

// 슬라이스 생성
const studygroupSlice = createSlice({
   name: 'studygroups',
   initialState: {
      studygroups: [],
      studygroup: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 스터디 그룹 목록 가져오기
      builder
         .addCase(fetchStudygroupsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchStudygroupsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.studygroups = action.payload
         })
         .addCase(fetchStudygroupsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 스터디 그룹 생성
         .addCase(createStudygroupThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createStudygroupThunk.fulfilled, (state, action) => {
            state.loading = false
            state.studygroups.push(action.payload) // 새로 생성된 스터디 그룹 추가
         })
         .addCase(createStudygroupThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 특정 스터디 그룹 가져오기
         .addCase(fetchStudygroupByIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchStudygroupByIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.studygroup = action.payload.studygroup
         })
         .addCase(fetchStudygroupByIdThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 스터디 그룹 업데이트
         .addCase(updateStudygroupThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateStudygroupThunk.fulfilled, (state, action) => {
            state.loading = false
            const index = state.studygroups.findIndex((group) => group.id === action.payload.id)
            if (index !== -1) {
               state.studygroups[index] = action.payload // 업데이트된 스터디 그룹으로 교체
            }
         })
         .addCase(updateStudygroupThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

         // 스터디 그룹 삭제
         .addCase(deleteStudygroupThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteStudygroupThunk.fulfilled, (state, action) => {
            state.loading = false
            state.studygroups = state.studygroups.filter((group) => group.id !== action.payload) // 삭제된 그룹 제거
         })
         .addCase(deleteStudygroupThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default studygroupSlice.reducer
