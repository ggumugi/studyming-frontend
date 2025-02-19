import axios from 'axios'

const apiUrl = 'http://localhost:5000'

//axios 인스턴스 생성
const pythonApi = axios.create({
   baseURL: apiUrl,
   headers: {
      'Content-Type': 'application/json',
   },
   withCredentials: true, // 세션 쿠키를 요청에 포함
})

export const fetchCaptcha = async () => {
   try {
      const response = await pythonApi.get(`/captchaImage`)
      console.log(response.data)
      return response.data
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

export const verifyCaptcha = async (token, userInput) => {
   try {
      const response = await pythonApi.post(`/verifyCaptcha`, { token, captcha: userInput })
      return response.data
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}
