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
      const formData = new FormData()
      formData.append('content', commentData.content)
      if (commentData.imageFile) {
         formData.append('image', commentData.imageFile) // ✅ 이미지 파일 추가
      }

      console.log('✅ FormData.append() 실행 완료!')
      formData.forEach((value, key) => {
         console.log(`✅ FormData key: ${key}, value:`, value)
      })

      // ✅ FormData 객체 복사 (혹시 모를 객체 변형 방지)
      const formDataCopy = new FormData()
      commentData.formData.forEach((value, key) => {
         formDataCopy.append(key, value)
      })

      console.log('🔥 API로 보낼 최종 FormData 데이터:')
      formDataCopy.forEach((value, key) => {
         console.log(`✅ API FormData key: ${key}, value:`, value)
      })

      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }

      console.log("✅ FormData.get('content') (append 실행 직후):", formData.get('content'))

      const response = await studymingApi.post(`${API_URL}/${commentData.postId}`, formDataCopy, config)
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
      console.log('📢 fetchComments 요청 시작! postId:', postId)

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
      const response = await studymingApi.get(`${API_URL}/${commentId}`) //detail 중간ㄴ에 껴있었음
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

/**
 * 4. 댓글 수정 (공지사항 예외 처리 제거)
 */
export const updateComment = async (id, commentData) => {
   try {
      console.log('🔥 API로 보낼 최종 FormData 데이터:')
      commentData.forEach((value, key) => {
         console.log(`✅ API commentData key: ${key}, value:`, value)
      })

      const config = {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      }

      const response = await studymingApi.put(`${API_URL}/${id}`, commentData, config) // ✅ API 경로 수정
      return response.data
   } catch (error) {
      console.error(`❌ 댓글 수정 API 요청 오류: ${error.message}`)
      throw error
   }
}

/**
 *  5. 댓글 삭제 (공지사항 예외 처리)
 */
export const deleteComment = async (commentId) => {
   try {
      console.log(`${API_URL}/${commentId}`) // 요청 URL 로그 확인
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
export const selectComment = async (id) => {
   try {
      const response = await studymingApi.patch(`/comment/${id}/select`)
      return response.data
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}
