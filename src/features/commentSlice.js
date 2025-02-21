import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createComment, updateComment, fetchComments, fetchCommentById, deleteComment } from '../api/commentApi'

//  댓글 생성 Thunk (이미지 업로드 가능)
export const createCommentThunk = createAsyncThunk('comments/createComment', async (commentData, { rejectWithValue }) => {
   try {
      const response = await createComment(commentData)
      return response.comment // ✅ API 응답에서 comment 데이터만 반환
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '댓글 등록 실패')
   }
})

//  특정 게시물의 댓글 목록 가져오기 (페이징 지원)
export const fetchCommentsThunk = createAsyncThunk('comments/fetchComments', async ({ postId, page, limit }, { rejectWithValue }) => {
   try {
      const response = await fetchComments({ postId, page, limit })
      return response
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '댓글 목록 조회 실패')
   }
})

//  특정 댓글 조회 Thunk
export const fetchCommentByIdThunk = createAsyncThunk('comments/fetchCommentById', async (id, { rejectWithValue }) => {
   try {
      const response = await fetchCommentById(id)
      return response.comment
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '댓글 조회 실패')
   }
})

//  댓글 수정 Thunk
export const updateCommentThunk = createAsyncThunk('comments/updateComment', async ({ id, commentData }, { rejectWithValue }) => {
   try {
      const response = await updateComment(id, commentData)
      return response.comment
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '댓글 수정 실패')
   }
})

//  댓글 삭제 Thunk
export const deleteCommentThunk = createAsyncThunk('comments/deleteComment', async (id, { rejectWithValue }) => {
   try {
      await deleteComment(id)
      return id // 삭제된 댓글의 id 반환
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '댓글 삭제 실패')
   }
})

//  Redux Slice 생성
const commentSlice = createSlice({
   name: 'comments',
   initialState: {
      comments: [], // 댓글 리스트
      comment: null, // 특정 댓글 상세 정보
      pagination: null, // 페이징 정보
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      //  댓글 생성
      builder
         .addCase(createCommentThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(createCommentThunk.fulfilled, (state, action) => {
            state.loading = false
            state.comments = [...state.comments, action.payload] // 리스트에 추가
         })
         .addCase(createCommentThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      //  특정 게시물의 댓글 목록 가져오기
      builder
         .addCase(fetchCommentsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchCommentsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.comments = action.payload.comments
            state.pagination = action.payload.pagination
         })
         .addCase(fetchCommentsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      //  특정 댓글 가져오기
      builder
         .addCase(fetchCommentByIdThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchCommentByIdThunk.fulfilled, (state, action) => {
            state.loading = false
            state.comment = action.payload
         })
         .addCase(fetchCommentByIdThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      //  댓글 수정
      builder
         .addCase(updateCommentThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateCommentThunk.fulfilled, (state, action) => {
            state.loading = false
            const index = state.comments.findIndex((comment) => comment.id === action.payload.id)
            if (index !== -1) state.comments[index] = action.payload
         })
         .addCase(updateCommentThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 댓글 삭제
      builder
         .addCase(deleteCommentThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteCommentThunk.fulfilled, (state, action) => {
            state.loading = false
            state.comments = state.comments.filter((comment) => comment.id !== action.payload) // 삭제된 댓글 제거
         })
         .addCase(deleteCommentThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default commentSlice.reducer
