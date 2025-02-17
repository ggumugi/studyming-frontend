import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { signupUser, loginUser, logoutUser, checkAuthStatus, googleLoginApi } from '../api/authApi' // ✅ 수정된 API

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
      // 로그아웃
      builder
         .addCase(logoutUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(logoutUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = false
            state.user = null // 로그아웃 후 유저 정보 초기화
         })
         .addCase(logoutUserThunk.rejected, (state, action) => {
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
