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
export const checkIdDuplicate = async (login_id) => {
   try {
      const response = await axios.get(`${API_URL}/auth/check-id`, { params: { login_id } })
      return response.data
   } catch (error) {
      throw error.response?.data?.message || '아이디 중복 확인 실패'
   }
}

// 닉네임 중복 확인 API
export const checkNicknameDuplicate = async (nickname) => {
   try {
      const response = await axios.get(`${API_URL}/auth/check-nickname`, { params: { nickname } })
      return response.data
   } catch (error) {
      throw error.response?.data?.message || '닉네임 중복 확인 실패'
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
      const response = await studymingApi.get('/auth/status')
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
