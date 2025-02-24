//관리자 정보게시판 슬라이스

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createAdminPost, fetchAdminPosts, updateAdminPost, deleteAdminPost, getAdminPostById } from '../api/adminpost'

/**
 * ✅ 1. 관리자 게시물 등록 (이미지 여러 개 업로드 가능)
 */
export const createAdminPostThunk = createAsyncThunk('adminPosts/createPost', async (postData, { rejectWithValue }) => {
   try {
      const response = await createAdminPost(postData)
      console.log(response.data, '슬라이스')
      return response.data.post
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '게시물 등록 실패')
   }
})

/**
 * ✅ 2. 전체 관리자 게시물 가져오기
 */
export const fetchAdminPostsThunk = createAsyncThunk('adminPosts/fetchPosts', async ({ page, limit, searchType, searchKeyword }, { rejectWithValue }) => {
   try {
      const response = await fetchAdminPosts({ page, limit, searchType, searchKeyword })

      if (!response || !response.data) {
         return rejectWithValue('응답 데이터가 없습니다.')
      }

      return response // ✅ 응답 반환
   } catch (error) {
      return rejectWithValue(error.message)
   }
})

/**
 * ✅ 3. 특정 관리자 게시물 가져오기
 */
export const fetchAdminPostByIdThunk = createAsyncThunk('adminPosts/fetchPostById', async (id, { rejectWithValue }) => {
   try {
      const response = await getAdminPostById(id)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 불러오기 실패')
   }
})

/**
 * ✅ 4. 관리자 게시물 수정
 */
export const updateAdminPostThunk = createAsyncThunk('adminPosts/updatePost', async (data, { rejectWithValue }) => {
   try {
      const { id, postData } = data
      const response = await updateAdminPost(id, postData)
      return response.data.post
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 수정 실패')
   }
})

/**
 * ✅ 5. 관리자 게시물 삭제
 */
export const deleteAdminPostThunk = createAsyncThunk('adminPosts/deletePost', async (id, { rejectWithValue }) => {
   try {
      await deleteAdminPost(id)
      return id // 삭제 후 삭제된 게시물의 id만 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 삭제 실패')
   }
})

// ✅ Redux Slice 생성
const adminPostSlice = createSlice({
   name: 'adminPosts',
   initialState: {
      posts: [],
      post: null,
      pagination: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // ✅ 게시물 등록
      builder
         .addCase(createAdminPostThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createAdminPostThunk.fulfilled, (state, action) => {
            state.loading = false
            state.posts = [...state.posts, action.payload]
         })
         .addCase(createAdminPostThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // ✅ 게시물 리스트 가져오기
      builder
         .addCase(fetchAdminPostsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchAdminPostsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.posts = action.payload?.data || [] // ✅ posts가 undefined일 경우 빈 배열로 설정
            state.pagination = action.payload?.pagination || { totalPosts: 0, currentPage: 1, totalPages: 1, limit: 10 }
         })
         .addCase(fetchAdminPostsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // ✅ 게시물 수정
      builder
         .addCase(updateAdminPostThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateAdminPostThunk.fulfilled, (state, action) => {
            state.loading = false
            // ✅ 수정된 게시물 찾기
            const index = state.posts.findIndex((post) => post.id === action.payload.id)
            if (index !== -1) {
               state.posts[index] = action.payload // ✅ 수정된 게시물 반영
            }
         })
         .addCase(updateAdminPostThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // ✅ 게시물 삭제
      builder
         .addCase(deleteAdminPostThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteAdminPostThunk.fulfilled, (state, action) => {
            state.loading = false
            state.posts = state.posts.filter((post) => post.id !== action.payload) // ✅ 삭제된 게시물 제거
         })
         .addCase(deleteAdminPostThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // ✅ 특정 게시물 가져오기
      builder
         .addCase(fetchAdminPostByIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchAdminPostByIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.post = action.payload.post
         })
         .addCase(fetchAdminPostByIdThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default adminPostSlice.reducer
