import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002'

// 회원가입
export const signupUser = async (userData) => {
   try {
      console.log('회원가입 요청 데이터:', userData) // ✅ 실제 프론트에서 보낼 데이터 확인
      const response = await axios.post(`${API_URL}/auth/signup`, userData, { withCredentials: true })
      return response.data
   } catch (error) {
      console.error('Signup failed', error)
      throw error
   }
}

// 아이디 중복 확인 API
export const checkIdDuplicate = async (login_id) => {
   try {
      const response = await axios.post(`${API_URL}/auth/check-id`, { login_id })
      return response.data
   } catch (error) {
      throw error.response?.data?.message || '아이디 중복 확인 실패'
   }
}

// 닉네임 중복 확인 API
export const checkNicknameDuplicate = async (nickname) => {
   try {
      const response = await axios.post(`${API_URL}/auth/check-nickname`, { nickname })
      return response.data
   } catch (error) {
      throw error.response?.data?.message || '닉네임 중복 확인 실패'
   }
}

// 로그인
export const loginUser = async (credentials) => {
   try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials, { withCredentials: true })
      return response.data
   } catch (error) {
      console.error('Login failed', error)
      throw error
   }
}

// 로그아웃
export const logoutUser = async () => {
   try {
      await axios.get(`${API_URL}/auth/logout`, { withCredentials: true })
   } catch (error) {
      console.error('Logout failed', error)
      throw error
   }
}

// 로그인 상태 확인
export const checkAuthStatus = async () => {
   try {
      const response = await axios.get(`${API_URL}/auth/status`, { withCredentials: true })
      return response.data
   } catch (error) {
      console.error('Auth check failed', error)
      throw error
   }
}

// 구글 로그인 (토큰 기반 로그인)
export const googleLoginApi = async (tokenId) => {
   try {
      const response = await axios.post(`${API_URL}/auth/google-login`, { tokenId }, { withCredentials: true })
      return response.data
   } catch (error) {
      console.error('Google login API failed', error)
      throw error
   }
}
