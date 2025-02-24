//스터디그룹 좋아요 기능 api
import studymingApi from './axiosApi'

const API_URL = '/studygroup' // 스터디 그룹 API 엔드포인트

/**
 *  1. 스터디 그룹 좋아요 추가/취소 (토글 기능)
 */
export const toggleStudyLike = async (groupId, userId) => {
   try {
      const response = await studymingApi.post(`${API_URL}/${groupId}/like`, { user: userId })
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

/**
 *  2. 특정 스터디 그룹의 좋아요 수 가져오기
 */
export const getStudyLikes = async (groupId) => {
   try {
      const response = await studymingApi.get(`${API_URL}/${groupId}/like`)
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}
