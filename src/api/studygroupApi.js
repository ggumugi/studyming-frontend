// studygroupApi.js (프론트엔드 API 요청)
import studymingApi from './axiosApi'

export const createStudygroup = async (groupData) => {
   try {
      const response = await studymingApi.post('/studygroup', groupData)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

export const getStudygroups = async () => {
   try {
      const response = await studymingApi.get('/studygroup')
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

export const getStudygroupById = async (id) => {
   try {
      const response = await studymingApi.get(`/studygroup/${id}`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

export const updateStudygroup = async (id, groupData) => {
   try {
      const response = await studymingApi.put(`/studygroup/${id}`, groupData)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

export const deleteStudygroup = async (id) => {
   try {
      const response = await studymingApi.delete(`/studygroup/${id}`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

export const getChannelInfo = async (groupId) => {
   try {
      const response = await studymingApi.get(`/studygroup/${groupId}/channel`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 해시태그 정보 가져오기
export const getStudyHashtags = async (studyId) => {
   try {
      const response = await studymingApi.get(`/studygroup/${studyId}`)
      return response.data
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 필터링된 스터디 검색
export const searchStudies = async (searchType, searchTerm) => {
   try {
      // 실제 API가 있다면 해당 API를 호출
      // 여기서는 클라이언트 측에서 필터링하므로 더미 함수로 구현
      return { success: true }
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}
