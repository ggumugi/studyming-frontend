import studymingApi from './axiosApi'

const API_URL = '/liked' // 좋아요 API 엔드포인트 (라우트와 맞춰야 함)

/**
 *  1. 스터디 그룹 좋아요 추가/취소 (토글 기능)
 */
export const toggleStudyLike = async (groupId) => {
   try {
      const response = await studymingApi.post(`${API_URL}/${groupId}`)
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
      const response = await studymingApi.get(`${API_URL}/${groupId}/count`) // 엔드포인트 맞추기
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

/**
 *  3. 현재 로그인한 사용자의 특정 스터디 좋아요 여부 확인
 */
export const checkUserLikeStatus = async (groupId) => {
   try {
      const response = await studymingApi.get(`${API_URL}/${groupId}/status`) // 좋아요 상태 확인
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}
