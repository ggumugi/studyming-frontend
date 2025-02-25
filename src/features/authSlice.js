import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { signupUser, loginUser, checkIdDuplicate, checkNicknameDuplicate, logoutUser, checkAuthStatus, sendVerificationCode, verifyCodeAndFindId, checkIdExists, checkEmailMatches, updatePassword, googleLoginApi, verifyCodepw } from '../api/authApi' // ✅ 수정된 API

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

//아이디 변경 부분
// ✅ 1. 이메일 인증 코드 전송 Thunk
export const sendCodeThunk = createAsyncThunk('auth/sendCode', async (email, { rejectWithValue }) => {
   try {
      const response = await sendVerificationCode(email)

      if (!response.success) {
         return rejectWithValue(response) // ✅ `success: false`이면 `rejectWithValue()` 실행
      }

      return response
   } catch (error) {
      return rejectWithValue(error.response?.data || { message: '인증 코드 요청 중 오류가 발생했습니다.' })
   }
})

// ✅ 2. 인증 코드 확인 및 아이디 찾기 Thunk
export const verifyCodeThunk = createAsyncThunk('auth/verifyCode', async ({ email, verificationCode }, { rejectWithValue }) => {
   try {
      const response = await verifyCodeAndFindId(email, verificationCode)

      if (!response.success) {
         return rejectWithValue(response) // ✅ 반드시 `rejectWithValue()` 사용
      }

      return response
   } catch (error) {
      return rejectWithValue(error.response?.data || { message: '인증 코드 확인 중 오류가 발생했습니다.' })
   }
})
//비밀번호 변경 부분

// 1. 아이디 검증
export const checkIdExistsThunk = createAsyncThunk('auth/checkIdExists', async (loginId, { rejectWithValue }) => {
   try {
      const response = await checkIdExists(loginId)
      return response // 성공 시 응답 반환
   } catch (error) {
      return rejectWithValue(error) // 에러 처리
   }
})

// 2. 아이디 & 이메일 검증 후 인증 코드 전송
export const checkEmailMatchesThunk = createAsyncThunk('auth/checkEmailMatches', async ({ loginId, email }, { rejectWithValue }) => {
   try {
      const response = await checkEmailMatches(loginId, email)
      return response // 성공 시 응답 반환
   } catch (error) {
      return rejectWithValue(error) // 에러 처리
   }
})

// 3. 인증 코드 검증
export const verifyCodepwThunk = createAsyncThunk('auth/verifyCode', async ({ email, verificationCodepw }, { rejectWithValue }) => {
   try {
      const response = await verifyCodepw(email, verificationCodepw)
      return response // 성공 시 응답 반환
   } catch (error) {
      return rejectWithValue(error) // 에러 처리
   }
})

// 4. 새 비밀번호 설정(비밀번호 변경)
export const updatePasswordThunk = createAsyncThunk('auth/updatePassword', async (newPassword, { rejectWithValue }) => {
   try {
      const response = await updatePassword(newPassword)
      return response // 성공 시 응답 반환
   } catch (error) {
      return rejectWithValue(error) // 에러 처리
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
      step: 1, // 비밀번호 찾기 단계
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

      // 1. 아이디 검증
      builder
         .addCase(checkIdExistsThunk.pending, (state) => {
            state.loading = true
         })
         .addCase(checkIdExistsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.successMessage = action.payload.message
            state.step = 2 // 이메일 입력 단계로 넘어가기
         })
         .addCase(checkIdExistsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 2. 아이디 & 이메일 검증 후 인증 코드 전송
      builder
         .addCase(checkEmailMatchesThunk.pending, (state) => {
            state.loading = true
         })
         .addCase(checkEmailMatchesThunk.fulfilled, (state, action) => {
            state.loading = false
            state.successMessage = action.payload.message
            state.step = 3 // 인증 코드 전송 단계로 넘어가기
         })
         .addCase(checkEmailMatchesThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      //내일 3번 작성
      // 4. 새 비밀번호 설정
      builder
         .addCase(updatePasswordThunk.pending, (state) => {
            state.loading = true
         })
         .addCase(updatePasswordThunk.fulfilled, (state, action) => {
            state.loading = false
            state.successMessage = action.payload.message
            state.step = 5 // 비밀번호 변경 완료 단계로 넘어가기
         })
         .addCase(updatePasswordThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
      //로그아웃
      builder
         .addCase(logoutUserThunk.pending, (state) => {
            state.loading = true
         })
         .addCase(logoutUserThunk.fulfilled, (state) => {
            state.loading = false
            state.isAuthenticated = false // ✅ 로그인 상태 해제
            state.user = null // ✅ 사용자 정보 초기화
         })
         .addCase(logoutUserThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload // ✅ 에러 메시지 저장
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
