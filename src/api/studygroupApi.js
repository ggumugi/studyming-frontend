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
