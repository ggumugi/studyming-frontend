import studymingApi from './axiosApi' // studymingApi 인스턴스를 import

// 회원가입
export const signupUser = async (userData) => {
   try {
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
      const response = await studymingApi.post('/auth/login', credentials)

      // ✅ 서버에서 "BANNED" 상태인지 확인
      if (response.data.status === 'BANNED') {
         throw new Error(response.data.endDate ? `정지된 계정입니다. ${response.data.endDate}까지 로그인이 불가능합니다.` : '영구 정지된 계정입니다.')
      }

      // ✅ 휴면 계정 (SLEEP) 처리 🚨
      if (response.data.status === 'SLEEP') {
         throw new Error('6개월 미접속으로 인해 휴면 계정이 되었습니다. 비밀번호를 변경한 후 이용해 주세요.')
      }

      return response.data
   } catch (error) {
      console.error('❌ 로그인 실패:', error.message)
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
export const verifyCodepw = async (email, verificationCodepw) => {
   try {
      const response = await studymingApi.post('auth/password-reset/verify-codepw', { email, verificationCodepw })
      return response.data
   } catch (error) {
      console.error('인증 코드 검증 실패', error)
      throw error.response ? error.response.data.message : '인증 코드 검증 중 오류 발생'
   }
}

// 새 비밀번호 설정 함수
export const updatePassword = async (info) => {
   try {
      const response = await studymingApi.patch('auth/password-reset/update-password', { email: info.email, newPassword: info.newPassword })
      return response.data
   } catch (error) {
      console.error('비밀번호 변경 실패', error)
      throw error.response ? error.response.data.message : '비밀번호 변경 중 오류 발생'
   }
}

// 로그아웃 API
export const logoutUser = async () => {
   try {
      const response = await studymingApi.get('/auth/logout') // ✅ 서버에 로그아웃 요청

      return response.data // ✅ 로그아웃 성공 메시지 반환
   } catch (error) {
      console.error('❌ 로그아웃 실패:', error)
      throw error.response?.data?.message || '로그아웃 중 오류가 발생했습니다.'
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

// 구글 로그인 API
export const googleLoginApi = async (decoded) => {
   try {
      const { email, name } = decoded // 구글 이메일과 닉네임 추출
      const response = await studymingApi.post('/auth/google-login', { email, name })

      if (response.data.success) {
         // 로그인 성공
         return response.data
      } else if (response.data.message === '회원가입이 필요합니다.') {
         // 사용자가 없는 경우
         throw new Error(response.data.message)
      } else if (response.data.message === '구글 연동된 계정이 아닙니다.') {
         // 일반 로그인 사용자인 경우
         throw new Error(response.data.message)
      } else {
         // 기타 오류
         throw new Error(response.data.message || '구글 로그인 실패')
      }
   } catch (error) {
      console.error('❌ 구글 로그인 실패:', error)
      throw error
   }
}
// 카카오 로그인
export const kakaoLoginApi = async (accessToken) => {
   try {
      const response = await studymingApi.post('/auth/kakao-login', { accessToken })

      if (!response?.data) {
         throw new Error('서버 응답이 올바르지 않습니다.')
      }

      if (response.data.success) {
         return response.data
      }

      // 📌 오류 코드 처리
      switch (response.data.code) {
         case 'signupRequired':
            throw new Error('회원가입이 필요합니다.')
         case 'notKakao':
            throw new Error('카카오 연동된 계정이 아닙니다.')
         default:
            throw new Error(response.data.message || '카카오 로그인 실패')
      }
   } catch (error) {
      console.error('❌ 카카오 로그인 API 오류:', error)
      throw new Error(error.message || '카카오 로그인 실패')
   }
}

// 카카오 사용자 정보 API
export const getKakaoUserInfo = async (accessToken) => {
   try {
      const response = await studymingApi.post('/auth/kakao-user-info', { accessToken })

      if (!response?.data) {
         throw new Error('서버 응답이 올바르지 않습니다.')
      }

      return response.data // 서버 응답 반환
   } catch (error) {
      console.error('❌ 카카오 사용자 정보 API 오류:', error)
      throw new Error(error.message || '사용자 정보 가져오기 실패')
   }
}

//  유저 리스트 가져오기 API
export const fetchUsers = async () => {
   try {
      const response = await studymingApi.get('/auth/users') // API 요청
      return response.data.users
   } catch (error) {
      console.error('❌ 유저 리스트 가져오기 실패:', error)
      throw error
   }
}

// 비밀번호 검증 API 요청을 추가합니다.
export const verifyPassword = async (password) => {
   try {
      const response = await studymingApi.post('/auth/verify-password', { password })
      return response.data
   } catch (error) {
      throw error.response?.data?.message || '비밀번호 확인 중 오류 발생'
   }
}

export const getUserInfo = async () => {
   try {
      // 기존에 구현된 /auth/user API 활용
      const response = await studymingApi.get('/auth/user')

      // 응답 데이터 구조 확인 및 변환
      if (response.data && response.data.isAuthenticated && response.data.user) {
         // 사용자 정보에 소셜 로그인 상태 추가 (실제 데이터가 없으므로 임시로 설정)
         const userData = {
            ...response.data.user,
            google: !!response.data.user.google, // 값이 있으면 true, 없으면 false
            kakao: !!response.data.user.kakao, // 값이 있으면 true, 없으면 false
         }

         return {
            success: true,
            user: userData,
         }
      }

      // 인증되지 않은 경우
      return {
         success: false,
         message: '인증된 사용자 정보가 없습니다.',
      }
   } catch (error) {
      console.error('❌ 사용자 정보 조회 실패:', error)
      throw error.response?.data?.message || '사용자 정보 조회 중 오류가 발생했습니다.'
   }
}

// 사용자 정보 업데이트 API
export const updateUserInfo = async (userData) => {
   try {
      const response = await studymingApi.patch('/auth/update', userData)
      return response.data
   } catch (error) {
      console.error('❌ 사용자 정보 업데이트 실패:', error)
      throw error.response?.data?.message || '사용자 정보 업데이트 중 오류가 발생했습니다.'
   }
}

// SNS 계정 연동 API
export const connectSnsAccount = async (data) => {
   try {
      const response = await studymingApi.patch('/auth/connect-sns', data, {
         withCredentials: true,
      })
      return response.data
   } catch (error) {
      console.error('❌ SNS 계정 연동 실패:', error)
      throw error.response?.data?.message || '연동 중 오류가 발생했습니다.'
   }
}

// 회원 탈퇴 API
export const deleteAccount = async () => {
   try {
      const response = await studymingApi.delete('/auth/delete-account', {
         withCredentials: true,
      })
      return response.data
   } catch (error) {
      console.error('❌ 회원 탈퇴 실패:', error)
      throw error.response?.data?.message || '회원 탈퇴 중 오류가 발생했습니다.'
   }
}
