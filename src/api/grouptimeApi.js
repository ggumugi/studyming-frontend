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
      console.log(`타이머 정보 업데이트 API 호출: 그룹 ID ${groupId}, 시간 ${time}`)
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

// 추가: 총 학습 시간 조회
export const getTotalStudyTime = async () => {
   try {
      const response = await studymingApi.get('/grouptime/total-time')
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}
