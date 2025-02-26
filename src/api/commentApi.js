/*지우*/
import studymingApi from './axiosApi'

const API_URL = '/comment' // ✅ 댓글 API 엔드포인트

/**
 *  1. 댓글 작성 (공지사항 예외 처리)
 */
export const createComment = async (commentData) => {
   if (commentData.postCategory === 'noti') {
      console.warn('공지사항에는 댓글을 작성할 수 없습니다.')
      return { success: false, message: '공지사항에는 댓글을 작성할 수 없습니다.' }
   }

   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }

      const response = await studymingApi.post(`${API_URL}/${commentData.postId}`, commentData, config)
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

/**
 * 2. 특정 포스트의 댓글 조회 (페이징, 공지사항 예외 처리)
 */
export const fetchComments = async ({ postId, postCategory, page = 1, limit = 10 }) => {
   if (postCategory === 'noti') {
      console.warn('공지사항에는 댓글이 없습니다.')
      return { success: false, message: '공지사항에는 댓글이 없습니다.' }
   }

   try {
      const response = await studymingApi.get(`${API_URL}/${postId}`, {
         params: { page, limit },
      })
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

/**
 *  3. 특정 댓글 조회 (공지사항 예외 처리)
 */
export const fetchCommentById = async ({ commentId, postCategory }) => {
   if (postCategory === 'noti') {
      console.warn('공지사항에는 댓글이 없습니다.')
      return { success: false, message: '공지사항에는 댓글이 없습니다.' }
   }

   try {
      const response = await studymingApi.get(`${API_URL}/detail/${commentId}`)
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

/**
 * 4. 댓글 수정 (공지사항 예외 처리)
 */
export const updateComment = async (commentData) => {
   if (commentData.postCategory === 'noti') {
      console.warn('공지사항의 댓글은 수정할 수 없습니다.')
      return { success: false, message: '공지사항의 댓글은 수정할 수 없습니다.' }
   }

   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }

      const response = await studymingApi.put(`${API_URL}/${commentData.commentId}`, commentData, config)
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

/**
 *  5. 댓글 삭제 (공지사항 예외 처리)
 */
export const deleteComment = async ({ commentId, postCategory }) => {
   if (postCategory === 'noti') {
      console.warn('공지사항의 댓글은 삭제할 수 없습니다.')
      return { success: false, message: '공지사항의 댓글은 삭제할 수 없습니다.' }
   }

   try {
      const response = await studymingApi.delete(`${API_URL}/${commentId}`)
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

/**
 *  6. 댓글 채택 API
 */
export const selectComment = async (commentId) => {
   try {
      const response = await studymingApi.patch(`/comment/${commentId}/select`)
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}
