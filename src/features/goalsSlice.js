import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getGoals, addGoal, updateGoal, deleteGoal } from '../api/goalsApi'

//  모든 Goals 불러오기 (비동기)
export const fetchGoals = createAsyncThunk('goals/fetchGoals', async () => {
   const data = await getGoals()
   return data
})

//  새로운 Goal 추가 (비동기)
export const addGoalAsync = createAsyncThunk('goals/addGoal', async (newGoal) => {
   const addedGoal = await addGoal(newGoal)
   return addedGoal
})

//  Goal 수정 (비동기)
export const updateGoalAsync = createAsyncThunk('goals/updateGoal', async ({ id, updatedGoal }) => {
   await updateGoal(id, updatedGoal)
   return { id, updatedGoal }
})

//  Goal 삭제 (비동기)
export const deleteGoalAsync = createAsyncThunk('goals/deleteGoal', async (id) => {
   await deleteGoal(id)
   return id
})

//  slice 생성
const goalsSlice = createSlice({
   name: 'goals',
   initialState: {
      goals: [],
      loading: false,
      error: null,
   },
   reducers: {}, // 여기에 일반 reducers 추가 가능

   extraReducers: (builder) => {
      builder
         //  Fetch Goals
         .addCase(fetchGoals.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchGoals.fulfilled, (state, action) => {
            state.loading = false
            state.goals = action.payload.map(({ id, monGoal, tueGoal, wedGoal, thuGoal, friGoal, satGoal, sunGoal }) => ({
               id,
               monGoal,
               tueGoal,
               wedGoal,
               thuGoal,
               friGoal,
               satGoal,
               sunGoal,
            })) // 불필요한 데이터 제거
         })
         .addCase(fetchGoals.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })

         //  Add Goal
         .addCase(addGoalAsync.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(addGoalAsync.fulfilled, (state, action) => {
            state.loading = false
            state.goals.push(action.payload)
         })
         .addCase(addGoalAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })

         //  Update Goal
         .addCase(updateGoalAsync.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateGoalAsync.fulfilled, (state, action) => {
            state.loading = false
            const index = state.goals.findIndex((g) => g.id === action.payload.id)
            if (index !== -1) {
               state.goals[index] = { ...state.goals[index], ...action.payload.updatedGoal }
            }
         })
         .addCase(updateGoalAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })

         //  Delete Goal
         .addCase(deleteGoalAsync.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteGoalAsync.fulfilled, (state, action) => {
            state.loading = false
            state.goals = state.goals.filter((g) => g.id !== action.payload)
         })
         .addCase(deleteGoalAsync.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })
   },
})

export default goalsSlice.reducer
