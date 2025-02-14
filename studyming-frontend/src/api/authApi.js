import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8002'

// 회원가입
export const registerUser = async (userData) => {
   try {
      const response = await axios.post(`${API_URL}/auth/register`, userData, { withCredentials: true })
      return response.data
   } catch (error) {
      console.error('Register failed', error)
      throw error
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
