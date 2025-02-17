import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

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

// 로그인
export const loginUser = async (credentials) => {
   try {
      console.log('📡 로그인 요청 데이터:', credentials)
      const response = await axios.post(`${API_URL}/auth/login`, credentials, { withCredentials: true })
      console.log('✅ 로그인 응답 데이터:', response.data)
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
