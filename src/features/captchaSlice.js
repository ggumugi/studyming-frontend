// slices/captchaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchCaptcha, verifyCaptcha } from '../api/captchaApi'

// 보안문자 생성 요청
export const fetchCaptchaThunk = createAsyncThunk('captcha/fetchCaptcha', async () => {
   const data = await fetchCaptcha()
   return data
})

// 보안문자 검증 요청
export const verifyCaptchaThunk = createAsyncThunk('captcha/verifyCaptcha', async ({ token, userInput }) => {
   const data = await verifyCaptcha(token, userInput)
   return data
})

const captchaSlice = createSlice({
   name: 'captcha',
   initialState: {
      captcha: null,
      isLoading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 보안문자 생성 요청
      builder
         .addCase(fetchCaptchaThunk.pending, (state) => {
            state.isLoading = true
         })
         .addCase(fetchCaptchaThunk.fulfilled, (state, action) => {
            state.isLoading = false
            state.captcha = action.payload
         })
         .addCase(fetchCaptchaThunk.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message
         })

      // 보안문자 검증 요청
      builder
         .addCase(verifyCaptchaThunk.pending, (state) => {
            state.isLoading = true
         })
         .addCase(verifyCaptchaThunk.fulfilled, (state, action) => {
            state.isLoading = false
         })
         .addCase(verifyCaptchaThunk.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message
         })
   },
})

export default captchaSlice.reducer
