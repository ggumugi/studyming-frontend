import studymingApi from './axiosApi'

const API_URL = '/post' // 서버 주소

// 게시글 목록 조회 (카테고리 필터링 가능)
export const fetchPosts = async (category = '') => {
   try {
      const response = await studymingApi.get(`${API_URL}${category ? `?category=${category}` : ''}`)
      return response.data // 성공 시 데이터 반환
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error // 오류 발생 시 throw
   }
}

// 특정 게시글 조회
export const fetchPostById = async (id) => {
   try {
      const response = await studymingApi.get(`${API_URL}/${id}`)
      return response.data // 성공 시 데이터 반환
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error // 오류 발생 시 throw
   }
}

// 게시글 생성
export const createPost = async (postData) => {
   try {
      const response = await studymingApi.post(API_URL, postData, {
         headers: { 'Content-Type': 'multipart/form-data' }, // 파일 업로드 처리
      })
      return response.data // 성공 시 데이터 반환
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error // 오류 발생 시 throw
   }
}

// 게시글 수정
export const updatePost = async (id, postData) => {
   try {
      const response = await studymingApi.put(`${API_URL}/${id}`, postData)
      return response.data // 성공 시 데이터 반환
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error // 오류 발생 시 throw
   }
}

// 게시글 삭제
export const deletePost = async (id) => {
   try {
      const response = await studymingApi.delete(`${API_URL}/${id}`)
      return response.data // 성공 시 데이터 반환
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error // 오류 발생 시 throw
   }
}
