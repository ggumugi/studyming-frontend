import studymingApi from './axiosApi' // studymingApi 인스턴스를 import

// 회원가입
export const signupUser = async (userData) => {
   try {
      console.log('회원가입 요청 데이터:', userData) // ✅ 실제 프론트에서 보낼 데이터 확인
      const response = await studymingApi.post('/auth/signup', userData)
      return response.data
   } catch (error) {
      console.error('Signup failed', error)
      throw error
   }
}

// 로그인
export const loginUser = async (credentials) => {
   try {
      console.log('📡 로그인 요청 데이터:', credentials)
      const response = await studymingApi.post('/auth/login', credentials)
      console.log('✅ 로그인 응답 데이터:', response.data)
      return response.data
   } catch (error) {
      console.error('Login failed', error)
      throw error
   }
}

// 아이디 중복 확인 API
export const checkIdDuplicate = async (loginId) => {
   try {
      const response = await studymingApi.get('/auth/check-id', { params: { loginId } })
      return { success: true, message: response.data.message } // ✅ 중복 아님
   } catch (error) {
      if (error.response?.status === 409) {
         return { success: false, message: '이미 사용 중인 아이디입니다.' } // ✅ 중복임
      }
      return { success: false, message: error.response?.data?.message || '아이디 중복 확인 실패' }
   }
}

// 닉네임 중복 확인 API
export const checkNicknameDuplicate = async (nickname) => {
   try {
      const response = await studymingApi.get('/auth/check-nickname', { params: { nickname } })
      return { success: true, message: response.data.message } // ✅ 중복 아님
   } catch (error) {
      if (error.response?.status === 409) {
         return { success: false, message: '이미 사용 중인 닉네임입니다.' } // ✅ 중복임
      }
      return { success: false, message: error.response?.data?.message || '닉네임 중복 확인 실패' }
   }
}

//아이디 찾기
//  1. 이메일로 인증 코드 요청
export const sendVerificationCode = async (email) => {
   try {
      const response = await studymingApi.post('/auth/find-id/send-code', { email })
      return { success: true, message: response.data.message } // ✅ 성공
   } catch (error) {
      return { success: false, message: error.response?.data?.message || '인증 코드 전송 실패' }
   }
}

//  2. 인증 코드 검증 및 아이디 찾기
export const verifyCodeAndFindId = async (email, verificationCode) => {
   try {
      const response = await studymingApi.post('/auth/find-id/verify-code', { email, verificationCode })
      return { success: true, loginId: response.data.loginId } // ✅ 성공
   } catch (error) {
      return { success: false, message: error.response?.data?.message || '인증 코드 확인 실패' }
   }
}

//비밀번호 찾기
// 아이디 검증 함수
export const checkIdExists = async (loginId) => {
   try {
      const response = await studymingApi.post('auth/password-reset/check-id', { loginId })
      return response.data
   } catch (error) {
      console.error('아이디 검증 실패', error)
      throw error.response ? error.response.data.message : '아이디 검증 중 오류 발생'
   }
}

// 이메일과 아이디 검증 후 인증 코드 전송 함수
export const checkEmailMatches = async (loginId, email) => {
   try {
      const response = await studymingApi.post('auth/password-reset/check-email', { loginId, email })
      return response.data
   } catch (error) {
      console.error('아이디와 이메일 검증 실패', error)
      throw error.response ? error.response.data.message : '아이디와 이메일 검증 중 오류 발생'
   }
}

// 인증 코드 검증 함수
export const verifyCodepw = async (email, verificationCode) => {
   try {
      const response = await studymingApi.post('auth/password-reset/verify-codepw', { email, verificationCode })
      return response.data
   } catch (error) {
      console.error('인증 코드 검증 실패', error)
      throw error.response ? error.response.data.message : '인증 코드 검증 중 오류 발생'
   }
}

// 새 비밀번호 설정 함수
export const updatePassword = async (newPassword) => {
   try {
      const response = await studymingApi.patch('auth/password-reset/update-password', { newPassword })
      return response.data
   } catch (error) {
      console.error('비밀번호 변경 실패', error)
      throw error.response ? error.response.data.message : '비밀번호 변경 중 오류 발생'
   }
}

// 로그아웃
export const logoutUser = async () => {
   try {
      await studymingApi.get('/auth/logout')
   } catch (error) {
      console.error('Logout failed', error)
      throw error
   }
}

// 로그인 상태 확인
export const checkAuthStatus = async () => {
   try {
      const response = await studymingApi.get('/auth/user')

      return response.data
   } catch (error) {
      console.error('Auth check failed', error)
      throw error
   }
}

// 구글 로그인 (토큰 기반 로그인)
export const googleLoginApi = async (tokenId) => {
   try {
      const response = await studymingApi.post('/auth/google-login', { tokenId })
      return response.data
   } catch (error) {
      console.error('Google login API failed', error)
      throw error
   }
}
