// api/grouptimeApi.js
import studymingApi from './axiosApi'

// 타이머 정보 조회
export const getGrouptime = async (groupId) => {
   try {
      const response = await studymingApi.get(`/grouptime/${groupId}`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 타이머 정보 업데이트
export const updateGrouptime = async (groupId, time) => {
   try {
      const response = await studymingApi.put(`/grouptime/${groupId}`, { time })
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 캡차 실패 처리
export const handleCaptchaFail = async (groupId) => {
   try {
      const response = await studymingApi.patch(`/grouptime/captcha-fail/${groupId}`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}
