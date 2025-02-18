import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { signupUser, loginUser, checkIdDuplicate, checkNicknameDuplicate, logoutUser, checkAuthStatus, sendVerificationCode, verifyCodeAndFindId, googleLoginApi } from '../api/authApi' // ✅ 수정된 API

// 회원가입
export const signupUserThunk = createAsyncThunk('auth/signupUser', async (userData, { rejectWithValue }) => {
   try {
      const response = await signupUser(userData)
      return response.user
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '회원가입 실패')
   }
})

// 로그인
export const loginUserThunk = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
   try {
      const response = await loginUser(credentials)
      return response.user
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그인 실패')
   }
})

// 아이디 중복 확인 Thunk
export const checkIdDuplicateThunk = createAsyncThunk('auth/checkIdDuplicate', async (login_id, { rejectWithValue }) => {
   try {
      const response = await checkIdDuplicate(login_id)
      return response
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '아이디 중복확인 실패')
   }
})

// 닉네임 중복 확인 Thunk
export const checkNicknameDuplicateThunk = createAsyncThunk('auth/checkNicknameDuplicate', async (nickname, { rejectWithValue }) => {
   try {
      const response = await checkNicknameDuplicate(nickname)
      return response
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '닉네임 중복 확인 실패')
   }
})

// ✅ 1. 이메일 인증 코드 전송 Thunk
export const sendCodeThunk = createAsyncThunk('auth/sendCode', async (email, { rejectWithValue }) => {
   try {
      return await sendVerificationCode(email)
   } catch (error) {
      return rejectWithValue(error)
   }
})

// ✅ 2. 인증 코드 확인 및 아이디 찾기 Thunk
export const verifyCodeThunk = createAsyncThunk('auth/verifyCode', async ({ email, verificationCode }, { rejectWithValue }) => {
   try {
      return await verifyCodeAndFindId(email, verificationCode)
   } catch (error) {
      return rejectWithValue(error)
   }
})

// 로그아웃
export const logoutUserThunk = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
   try {
      await logoutUser()
      return null
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '로그아웃 실패')
   }
})

// 로그인 상태 확인
export const checkAuthStatusThunk = createAsyncThunk('auth/checkAuthStatus', async (_, { rejectWithValue }) => {
   try {
      const response = await checkAuthStatus()
      return response
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '상태 확인 실패')
   }
})

// 구글 로그인
export const googleLoginThunk = createAsyncThunk('auth/googleLogin', async (tokenId, { rejectWithValue }) => {
   try {
      const response = await googleLoginApi(tokenId)
      return response.user
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '구글 로그인 실패')
   }
})

const authSlice = createSlice({
   name: 'auth',
   initialState: {
      user: null,
      isAuthenticated: false, // 로그인 상태: 로그인이 되어 있으면 true, 그렇지 않으면 false
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 회원가입
      builder
         .addCase(signupUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(signupUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.user = action.payload
         })
         .addCase(signupUserThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 로그인
      builder
         .addCase(loginUserThunk.pending, (state) => {
            console.log('🔄 로그인 요청 중...')
            state.loading = true
            state.error = null
         })
         .addCase(loginUserThunk.fulfilled, (state, action) => {
            console.log('✅ 로그인 성공:', action.payload)
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload
         })
         .addCase(loginUserThunk.rejected, (state, action) => {
            console.log('❌ 로그인 실패:', action.payload)
            state.loading = false
            state.error = action.payload
         })
         // 아이디 중복 확인
         .addCase(checkIdDuplicateThunk.pending, (state) => {
            state.loading = true
            state.idCheckMessage = null
            state.error = null
         })
         .addCase(checkIdDuplicateThunk.fulfilled, (state, action) => {
            state.loading = false
            state.idCheckMessage = action.payload.message
         })
         .addCase(checkIdDuplicateThunk.rejected, (state, action) => {
            state.loading = false
            state.idCheckMessage = action.payload
         })

         // 닉네임 중복 확인
         .addCase(checkNicknameDuplicateThunk.pending, (state) => {
            state.loading = true
            state.nicknameCheckMessage = null
            state.error = null
         })
         .addCase(checkNicknameDuplicateThunk.fulfilled, (state, action) => {
            state.loading = false
            state.nicknameCheckMessage = action.payload.message
         })
         .addCase(checkNicknameDuplicateThunk.rejected, (state, action) => {
            state.loading = false
            state.nicknameCheckMessage = action.payload
         })
         //인증코드 보내기(아이디)
         .addCase(sendCodeThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(sendCodeThunk.fulfilled, (state, action) => {
            state.loading = false
            state.successMessage = action.payload.message
         })
         .addCase(sendCodeThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         //인증번호 확인(아이디)
         .addCase(verifyCodeThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(verifyCodeThunk.fulfilled, (state, action) => {
            state.loading = false
            state.loginId = action.payload.loginId
         })
         .addCase(verifyCodeThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      // 로그인 상태 확인
      builder
         .addCase(checkAuthStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(checkAuthStatusThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = action.payload.isAuthenticated
            state.user = action.payload.user || null
         })
         .addCase(checkAuthStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
            state.isAuthenticated = false
            state.user = null
         })
      // 구글 로그인
      builder
         .addCase(googleLoginThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(googleLoginThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload
         })
         .addCase(googleLoginThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default authSlice.reducer
