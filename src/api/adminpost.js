//관리자 게시판 api
import studymingApi from './axiosApi'

const API_URL = '/admin-post' // 관리자 게시판 서버 주소

/**
 * ✅ 1. 관리자 게시글 생성 (이미지 여러 개 업로드 가능)
 */
export const createAdminPost = async (postData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data', // 파일 전송 시 지정 필수
         },
      }

      const response = await studymingApi.post(API_URL, postData, config)
      console.log(response, 'api')
      return response
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

/**
 * ✅ 2. 관리자 게시글 목록 조회 (페이징 및 검색 가능)
 */
export const fetchAdminPosts = async ({ page, limit, searchType, searchKeyword }) => {
   try {
      const params = {
         page,
         limit: limit || 10,
         [searchType]: searchKeyword, // 동적 검색 조건
      }
      const response = await studymingApi.get(API_URL, { params })

      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

/**
 * ✅ 3. 특정 관리자 게시글 조회
 */
export const getAdminPostById = async (id) => {
   try {
      const response = await studymingApi.get(`${API_URL}/${id}`)
      return response
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

/**
 * ✅ 4. 관리자 게시글 수정 (이미지 포함)
 */
export const updateAdminPost = async (id, postData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data', // 파일 전송 시 반드시 지정
         },
      }

      const response = await studymingApi.put(`${API_URL}/${id}`, postData, config)
      return response
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

/**
 * ✅ 5. 관리자 게시글 삭제
 */
export const deleteAdminPost = async (id) => {
   try {
      const response = await studymingApi.delete(`${API_URL}/${id}`)
      return response
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}
