import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getDdays, addDday, updateDday, deleteDday } from '../api/dDayApi'

// ✅ 모든 D-day 불러오기 (비동기)
export const fetchDdays = createAsyncThunk('dDay/fetchDdays', async () => {
   const data = await getDdays()
   return data
})

// ✅ 새로운 D-day 추가 (비동기)
export const addDdayAsync = createAsyncThunk('dDay/addDday', async (newDday) => {
   const addedDday = await addDday(newDday)
   return addedDday
})

// ✅ D-day 수정 (비동기)
export const updateDdayAsync = createAsyncThunk('dDay/updateDday', async ({ id, updatedDday }) => {
   await updateDday(id, updatedDday)
   return { id, updatedDday }
})

// ✅ D-day 삭제 (비동기)
export const deleteDdayAsync = createAsyncThunk('dDay/deleteDday', async (id) => {
   await deleteDday(id)
   return id
})

// ✅ slice 생성
const ddaySlice = createSlice({
   name: 'dDay',
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
