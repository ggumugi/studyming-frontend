import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMindset, addMindset, updateMindset, deleteMindset } from '../api/mindsetApi'

//  모든 mindset 불러오기 (비동기)
export const fetchMindsets = createAsyncThunk('mindset/fetchMindsets', async () => {
   const data = await getMindset()
   return data
})

//  새로운 mindset 추가 (비동기)
export const addMindsetAsync = createAsyncThunk('mindset/addMindset', async (newMindset) => {
   const addedMindset = await addMindset(newMindset)
   return addedMindset
})

//  mindset 수정 (비동기)
export const updateMindsetAsync = createAsyncThunk('mindset/updateMindset', async ({ id, updatedMindset }) => {
   await updateMindset(id, updatedMindset)
   return { id, updatedMindset }
})

//  mindset 삭제 (비동기)
export const deleteMindsetAsync = createAsyncThunk('mindset/deleteMindset', async (id) => {
   await deleteMindset(id)
   return id
})

//  slice 생성
const mindsetSlice = createSlice({
   name: 'mindset',
   initialState: {
      mindsets: [],
      loading: false,
      error: null,
   },
   reducers: {}, // 여기에 일반 reducers 추가 가능

   extraReducers: (builder) => {
      builder
         //  Fetch mindset
         .addCase(fetchMindsets.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchMindsets.fulfilled, (state, action) => {
            state.loading = false
            state.mindsets = action.payload
         })
         .addCase(fetchMindsets.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })

         //  Add mindset
         .addCase(addMindsetAsync.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(addMindsetAsync.fulfilled, (state, action) => {
            state.loading = false
            state.mindsets.push(action.payload)
         })
         .addCase(addMindsetAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })

         //  Update mindset
         .addCase(updateMindsetAsync.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateMindsetAsync.fulfilled, (state, action) => {
            state.loading = false
            const index = state.mindsets.findIndex((d) => d.id === action.payload.id)
            if (index !== -1) {
               state.mindsets[index] = { ...state.mindsets[index], ...action.payload.updatedMindset }
            }
         })
         .addCase(updateMindsetAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })

         //  Delete mindset
         .addCase(deleteMindsetAsync.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteMindsetAsync.fulfilled, (state, action) => {
            state.loading = false
            state.mindsets = state.mindsets.filter((d) => d.id !== action.payload)
         })
         .addCase(deleteMindsetAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })
   },
})

export default mindsetSlice.reducer
