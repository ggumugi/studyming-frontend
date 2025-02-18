import axios from 'axios'

const BASE_URL = process.env.REACT_APP_API_URL

//axios 인스턴스 생성
const studymingApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true, // 세션 쿠키를 요청에 포함
})

export default studymingApi
