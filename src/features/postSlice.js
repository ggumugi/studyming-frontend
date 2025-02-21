import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createPost, fetchPosts /* , fetchPostById, updatePost, deletePost */ } from '../api/postApi'

// 게시물 등록 thunk (이미지 여러 개 업로드)
export const createPostThunk = createAsyncThunk('posts/createPost', async (postData, { rejectWithValue }) => {
   try {
      const response = await createPost(postData)
      console.log(response.data, '슬라이스')
      return response.data.post
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '게시물 등록 실패')
   }
})

/* // 게시물 수정 thunk (이미지 여러 개 업로드)
export const updatePostThunk = createAsyncThunk('posts/updatePost', async (data, { rejectWithValue }) => {
   try {
      const { id, postData } = data
      const formData = new FormData()
      formData.append('title', postData.title)
      formData.append('content', postData.content)

      // 이미지 파일 추가
      postData.images.forEach((image, index) => {
         formData.append('images', image)
      })

      const response = await updatePost(id, formData)
      return response.data.post
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '게시물 수정 실패')
   }
})

// 게시물 삭제 thunk
export const deletePostThunk = createAsyncThunk('posts/deletePost', async (id, { rejectWithValue }) => {
   try {
      await deletePost(id)
      return id // 삭제 후 삭제된 게시물의 id만 반환
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '게시물 삭제 실패')
   }
})

// 특정 게시물 조회 thunk
export const fetchPostByIdThunk = createAsyncThunk('posts/fetchPostById', async (id, { rejectWithValue }) => {
   try {
      const response = await fetchPostById(id)
      return response.data
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '특정 게시물 조회 실패')
   }
}) */

// 전체 게시물 리스트 가져오기
export const fetchPostsThunk = createAsyncThunk('posts/fetchPosts', async ({ page, category }, { rejectWithValue }) => {
   try {
      const response = await fetchPosts({ page, category })

      if (!response || !response.posts) {
         return rejectWithValue('응답에 posts가 없습니다.')
      }

      return response // ✅ 응답 반환
   } catch (error) {
      return rejectWithValue(error.message)
   }
})

// // 특정 유저 게시물 리스트 가져오기
// export const fetchPostsByUserIdThunk = createAsyncThunk('posts/fetchPostsByUserId', async ({ page, id }, { rejectWithValue }) => {
//    try {
//       const response = await getPostsByUserId(page, id)
//       return response.data
//    } catch (err) {
//       return rejectWithValue(err.response?.data?.message || '유저 게시물 조회 실패')
//    }
// })

// // 관심글 게시물 리스트 가져오기
// export const getPostsByLikedThunk = createAsyncThunk('posts/getPostsByLiked', async ({ page, id }, { rejectWithValue }) => {
//    try {
//       const response = await getPostsByLiked(page, id)
//       return response.data
//    } catch (err) {
//       return rejectWithValue(err.response?.data?.message || '유저 게시물 조회 실패')
//    }
// })

const postSlice = createSlice({
   name: 'posts',
   initialState: {
      posts: [],
      post: null,
      pagination: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      //게시물 등록
      builder
         .addCase(createPostThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createPostThunk.fulfilled, (state, action) => {
            state.loading = false
            state.posts = [...state.posts, action.payload]
         })
         .addCase(createPostThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      /*  builder
         .addCase(updatePostThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updatePostThunk.fulfilled, (state, action) => {
            state.loading = false
            const index = state.posts.findIndex((post) => post.id === action.payload.id)
            if (index !== -1) state.posts[index] = action.payload
         })
         .addCase(updatePostThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         }) */
      //게시물 리스트 불러오기
      builder
         .addCase(fetchPostsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchPostsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.posts = action.payload?.posts || [] // ✅ posts가 undefined일 경우 빈 배열로 설정
            state.pagination = action.payload?.pagination || { totalPosts: 0, currentPage: 1, totalPages: 1, limit: 10 }
         })

         .addCase(fetchPostsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      /*  builder
         .addCase(fetchPostByIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchPostByIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.post = action.payload.post
         })
         .addCase(fetchPostByIdThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         }) */

      /*  builder
         .addCase(deletePostThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deletePostThunk.fulfilled, (state, action) => {
            state.loading = false
            state.posts = state.posts.filter((post) => post.id !== action.payload)
         })
         .addCase(deletePostThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })*/
   },
})

export default postSlice.reducer
