import studymingApi from './axiosApi'

const API_URL = '/post' // 서버 주소

// 게시글 생성 (이미지 여러 개 업로드)
export const createPost = async (postData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data', // 파일 전송시 반드시 지정
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

// 게시글 목록 조회 (카테고리 필터링 가능)
export const fetchPosts = async ({ page, category, limit, searchType, searchKeyword }) => {
   try {
      const params = {
         page,
         category,
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

//전체 포스트 가져오기(페이징)
export const getPosts = async (page) => {
   try {
      const response = await studymingApi.get(`/post?page=${page}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.message}`)
      throw error
   }
}

//포스트 수정
export const updatePost = async (id, postData) => {
   try {
      //postData: 수정할 게시물 데이터가 담겨있는 json객체

      const config = {
         headers: {
            'Content-Type': 'multipart/form-data', // 파일 전송시 반드시 지정
         },
      }

      const response = await studymingApi.put(`/post/${id}`, postData, config)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.message}`)
      throw error
   }
}

//포스트 삭제
export const deletePost = async (id) => {
   try {
      const response = await studymingApi.delete(`/post/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.message}`)
      throw error
   }
}

//특정 포스트 가져오기
export const getPostById = async (id) => {
   try {
      const response = await studymingApi.get(`/post/${id}`)
      return response
   } catch (error) {
      console.error(`API Request 오류: ${error.message}`)
      throw error
   }
}
