// studyListApi.js (프론트엔드 API 요청)
import studymingApi from './axiosApi'

// 모든 스터디 그룹 목록 조회
export const getAllStudyGroups = async () => {
   try {
      const response = await studymingApi.get('/studylist')
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 특정 스터디 그룹의 해시태그 조회
export const getStudyGroupHashtags = async (studyId) => {
   try {
      const response = await studymingApi.get(`/studylist/${studyId}/hashtags`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 스터디 그룹 검색
export const searchStudyGroups = async (searchType, searchTerm) => {
   try {
      const response = await studymingApi.get(`/studylist/search`, {
         params: { searchType, searchTerm },
      })
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 내가 참여한 스터디 그룹 목록 조회
export const getMyStudyGroups = async () => {
   try {
      const response = await studymingApi.get('/studylist/my')
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 스터디 그룹 삭제 (관리자 전용)
export const deleteStudyGroup = async (studyId) => {
   try {
      const response = await studymingApi.delete(`/studylist/${studyId}`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}
