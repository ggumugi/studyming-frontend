import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMindset, addMindset, updateMindset, deleteMindset } from '../api/mindsetApiApi'

//  모든 mindset 불러오기 (비동기)
export const fetchMindsets = createAsyncThunk('mindset/fetchMindsets', async () => {
   const data = await getMindset()
   return data
})

/* 여기서부터 보기 */

//  새로운 mindset 추가 (비동기)
export const addMindsetAsync = createAsyncThunk('mindset/addMindset', async (newMindset) => {
   const addedMindset = await addMindset(newMindset)
   return addedMindset
})

//  mindset 수정 (비동기)
export const updateMindsetAsync = createAsyncThunk('mindset/updateMindset', async ({ id, updatedMindset }) => {
   await updateMindset(id, updatedMindset)
   return { id, updateMindset }
})

//  mindset 삭제 (비동기)
export const deleteDdayAsync = createAsyncThunk('mindset/deleteDday', async (id) => {
   await deleteMindset(id)
   return id
})

//  slice 생성
const ddaySlice = createSlice({
   name: 'mindset',
   initialState: {
      dDays: [],
      loading: false,
      error: null,
   },
   reducers: {}, // 여기에 일반 reducers 추가 가능

   extraReducers: (builder) => {
      builder
         // 🔹 Fetch Ddays (전체 일정 불러오기)
         .addCase(fetchDdays.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchDdays.fulfilled, (state, action) => {
            state.loading = false
            state.ddays = action.payload
         })
         .addCase(fetchDdays.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })

         // 🔹 Add Dday (새 일정 추가)
         .addCase(addDdayAsync.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(addDdayAsync.fulfilled, (state, action) => {
            state.loading = false
            state.dDays.push(action.payload)
         })
         .addCase(addDdayAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })

         // 🔹 Update Dday (일정 업데이트)
         .addCase(updateDdayAsync.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateDdayAsync.fulfilled, (state, action) => {
            state.loading = false
            const index = state.dDays.findIndex((d) => d.id === action.payload.id)
            if (index !== -1) {
               state.dDays[index] = { ...state.dDays[index], ...action.payload.updatedDday }
            }
         })
         .addCase(updateDdayAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })

         // 🔹 Delete Dday (일정 삭제)
         .addCase(deleteDdayAsync.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteDdayAsync.fulfilled, (state, action) => {
            state.loading = false
            state.ddays = state.dDays.filter((d) => d.id !== action.payload)
         })
         .addCase(deleteDdayAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })
   },
})

export default dDaySlice.reducer
