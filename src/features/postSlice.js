import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createPost, fetchPosts, updatePost, deletePost, getPostById } from '../api/postApi'

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

// 전체 게시물 리스트 가져오기
/* export const fetchPostsThunk = createAsyncThunk('posts/fetchPosts', async ({ page, category }, { rejectWithValue }) => {
   try {
      const response = await fetchPosts({ page, category })

      if (!response || !response.posts) {
         return rejectWithValue('응답에 posts가 없습니다.')
      }

      return response // ✅ 응답 반환
   } catch (error) {
      return rejectWithValue(error.message)
   }
}) */
export const fetchPostsThunk = createAsyncThunk('posts/fetchPosts', async ({ page, category, limit, searchType, searchKeyword }, { rejectWithValue }) => {
   try {
      console.log(`🛠 Redux Thunk 요청: page=${page}, category=${category}, searchType=${searchType}, searchKeyword=${searchKeyword}`)
      const response = await fetchPosts({ page, category, limit, searchType, searchKeyword })

      if (!response || !response.posts) {
         return rejectWithValue('응답에 posts가 없습니다.')
      }

      return response
   } catch (error) {
      return rejectWithValue(error.message)
   }
})

//게시물 수정
export const updatePostThunk = createAsyncThunk('posts/updatePost', async ({ id, postData, imagesToRemove }, { rejectWithValue }) => {
   try {
      const response = await updatePost(id, postData, imagesToRemove)
      console.log('수정된 게시글 데이터:', response.data)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시글 수정 실패')
   }
})

// 게시물 삭제
export const deletePostThunk = createAsyncThunk('posts/deletePost', async (id, { rejectWithValue }) => {
   try {
      // eslint-disable-next-line
      const response = await deletePost(id)
      return id // 삭제 성공 후 삭제된 게시물의 id만 반환
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 삭제 실패')
   }
})

// 특정 게시물 가져오기
export const fetchPostByIdThunk = createAsyncThunk('posts/fetchPostById', async (id, { rejectWithValue }) => {
   try {
      const response = await getPostById(id)
      console.log('Redux에 저장될 게시글 데이터:', response.data)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '게시물 불러오기 실패')
   }
})

const postSlice = createSlice({
   name: 'posts',
   initialState: {
      posts: [],
      post: null,
      category: 'free',
      pagination: null,
      loading: false,
      error: null,
   },
   reducers: {
      setCategory: (state, action) => {
         state.category = action.payload
      },
      resetPost: (state) => {
         state.post = null // ✅ 글쓰기 페이지 이동 시 기존 `post` 데이터 초기화
      },
   },
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

      //게시물 리스트 불러오기
      builder
         .addCase(fetchPostsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchPostsThunk.fulfilled, (state, action) => {
            state.loading = false
            if (action.payload?.posts.length > 0) {
               state.posts = action.payload.posts
            }
            state.pagination = action.payload?.pagination || {
               totalPosts: 0,
               currentPage: 1,
               totalPages: 1,
               limit: 10,
            }
         })

         .addCase(fetchPostsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 게시물 수정
      builder
         .addCase(updatePostThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updatePostThunk.fulfilled, (state, action) => {
            state.loading = false
            // ✅ 수정된 게시물 찾기
            const index = state.posts.findIndex((post) => post.id === action.payload.id)
            if (index !== -1) {
               state.posts[index] = action.payload // ✅ 수정된 게시물 반영
            }
         })
         .addCase(updatePostThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 게시물 삭제
      builder
         .addCase(deletePostThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deletePostThunk.fulfilled, (state, action) => {
            state.loading = false
         })
         .addCase(deletePostThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 특정 게시물 불러오기
      builder
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
         })
   },
})

export default postSlice.reducer
export const { setCategory, resetPost } = postSlice.actions // ✅ setCategory 액션 추가
