// slices/captchaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchCaptcha, verifyCaptcha } from '../api/captchaApi'

// 보안문자 생성 요청
export const fetchCaptchaThunk = createAsyncThunk('captcha/fetchCaptcha', async () => {
   const data = await fetchCaptcha()
   return {
      img: data.img,
      token: data.token,
      answer: data.captchaText, // 서버에서 받은 정답 저장
   }
})

// 보안문자 검증 요청
export const verifyCaptchaThunk = createAsyncThunk('captcha/verifyCaptcha', async ({ token, userInput }, { getState }) => {
   // 서버로 검증 요청 보내기
   const response = await verifyCaptcha(token, userInput.toUpperCase()) // 대문자로 변환하여 전송

   // 응답에 성공 여부 포함
   return {
      ...response,
      isCorrect: response.success,
      userInput,
   }
})

const captchaSlice = createSlice({
   name: 'captcha',
   initialState: {
      captcha: null,
      isLoading: false,
      error: null,
      verificationResult: null, // 검증 결과 저장
   },
   reducers: {
      clearVerificationResult: (state) => {
         state.verificationResult = null
      },
   },
   extraReducers: (builder) => {
      // 보안문자 생성 요청
      builder
         .addCase(fetchCaptchaThunk.pending, (state) => {
            state.isLoading = true
            state.error = null
         })
         .addCase(fetchCaptchaThunk.fulfilled, (state, action) => {
            state.isLoading = false
            state.captcha = action.payload
            state.verificationResult = null // 새 캡차 생성 시 검증 결과 초기화
         })
         .addCase(fetchCaptchaThunk.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message
         })

      // 보안문자 검증 요청
      builder
         .addCase(verifyCaptchaThunk.pending, (state) => {
            state.isLoading = true
            state.error = null
         })
         .addCase(verifyCaptchaThunk.fulfilled, (state, action) => {
            state.isLoading = false
            state.verificationResult = action.payload
         })
         .addCase(verifyCaptchaThunk.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message
            state.verificationResult = {
               isCorrect: false,
               message: '서버 오류로 인증에 실패했습니다.',
            }
         })
   },
})

export const { clearVerificationResult } = captchaSlice.actions
export default captchaSlice.reducer
