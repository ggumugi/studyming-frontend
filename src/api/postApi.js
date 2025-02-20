import axios from 'axios'

const API_URL = '/post' // 서버 주소

// 게시글 목록 조회 (카테고리 필터링 가능)
export const fetchPosts = async (category = '') => {
   const response = await axios.get(`${API_URL}${category ? `?category=${category}` : ''}`)
   return response.data
}

// 특정 게시글 조회
export const fetchPostById = async (id) => {
   const response = await axios.get(`${API_URL}/${id}`)
   return response.data
}

// 게시글 생성
export const createPost = async (postData) => {
   const response = await axios.post(API_URL, postData)
   return response.data
}

// 게시글 수정
export const updatePost = async (id, postData) => {
   const response = await axios.put(`${API_URL}/${id}`, postData)
   return response.data
}

// 게시글 삭제
export const deletePost = async (id) => {
   const response = await axios.delete(`${API_URL}/${id}`)
   return response.data
}
