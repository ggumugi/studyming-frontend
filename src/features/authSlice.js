import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { signupUser, checkIdDuplicate, checkNicknameDuplicate, loginUser, logoutUser, checkAuthStatus, googleLoginApi } from '../api/authApi' // ✅ 수정된 API

// 회원가입
export const signupUserThunk = createAsyncThunk('auth/signupUser', async (userData, { rejectWithValue }) => {
   try {
      const response = await signupUser(userData)
      return response.user
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '회원가입 실패')
   }
})

// 아이디 중복 확인
export const checkIdDuplicateThunk = createAsyncThunk('auth/checkId', async (login_id, { rejectWithValue }) => {
   try {
      return await checkIdDuplicate(login_id)
   } catch (err) {
      return rejectWithValue(err)
   }
})

// 닉네임 중복 확인
export const checkNicknameDuplicateThunk = createAsyncThunk('auth/checkNickname', async (nickname, { rejectWithValue }) => {
   try {
      return await checkNicknameDuplicate(nickname)
   } catch (err) {
      return rejectWithValue(err)
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
      loading: true,
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

         // ✅ 아이디 중복 확인 Thunk
         .addCase(checkIdDuplicateThunk.pending, (state) => {
            state.loading = true
            state.idCheckMessage = null
            state.error = null
         })
         .addCase(checkIdDuplicateThunk.fulfilled, (state, action) => {
            state.loading = false
            state.idCheckMessage = action.payload.success ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.'
         })
         .addCase(checkIdDuplicateThunk.rejected, (state, action) => {
            state.loading = false
            state.idCheckMessage = '아이디 중복 확인 실패'
            state.error = action.payload
         })

         // ✅ 닉네임 중복 확인 Thunk
         .addCase(checkNicknameDuplicateThunk.pending, (state) => {
            state.loading = true
            state.nicknameCheckMessage = null
            state.error = null
         })
         .addCase(checkNicknameDuplicateThunk.fulfilled, (state, action) => {
            state.loading = false
            state.nicknameCheckMessage = action.payload.success ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.'
         })
         .addCase(checkNicknameDuplicateThunk.rejected, (state, action) => {
            state.loading = false
            state.nicknameCheckMessage = '닉네임 중복 확인 실패'
            state.error = action.payload
         })
      // 로그인
      builder
         .addCase(loginUserThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(loginUserThunk.fulfilled, (state, action) => {
            state.loading = false
            state.isAuthenticated = true
            state.user = action.payload
         })
         .addCase(loginUserThunk.rejected, (state, action) => {
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
