import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createStudygroup, getStudygroups, getStudygroupById, updateStudygroup, deleteStudygroup } from '../api/studygroupApi'

export const fetchStudygroupsThunk = createAsyncThunk('studygroups/fetchAll', async (_, { rejectWithValue }) => {
   try {
      const response = await getStudygroups()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '스터디 그룹 목록 불러오기 실패')
   }
})

const studygroupSlice = createSlice({
   name: 'studygroups',
   initialState: { studygroups: [], loading: false, error: null },
   reducers: {},
   extraReducers: (builder) => {
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
   },
})

export default studygroupSlice.reducer
