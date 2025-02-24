/*지우*/

import studymingApi from './axiosApi'

const API_URL = '/comment' // 서버 주소

// ✅ 댓글 생성 (이미지 업로드 가능)
export const createComment = async (commentData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'application/json', // ✅ JSON으로 전송
         },
      }

      const response = await studymingApi.post(API_URL, commentData, config)
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

// ✅ 특정 게시물의 댓글 목록 조회 (페이징 지원)(특정 게시물의 전체댓글)
export const fetchComments = async ({ postId, page = 1, limit = 5 }) => {
   try {
      const params = { postId, page, limit }
      const response = await studymingApi.get(API_URL, { params })
      return response.data // 성공 시 데이터 반환
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

//특정 댓글 조회 (댓글 상세보기)
export const fetchCommentById = async (id) => {
   try {
      const response = await studymingApi.get(`${API_URL}/${id}`)
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

// ✅ 댓글 수정 (내용 및 이미지 변경 가능)
export const updateComment = async (id, commentData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }

      const response = await studymingApi.patch(`${API_URL}/${id}`, commentData, config)
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

// ✅ 댓글 삭제
export const deleteComment = async (id) => {
   try {
      const response = await studymingApi.delete(`${API_URL}/${id}`)
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}
