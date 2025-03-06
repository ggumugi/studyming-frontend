import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createComment, updateComment, fetchComments, fetchCommentById, deleteComment, selectComment } from '../api/commentApi'

//  댓글 생성 Thunk (이미지 업로드 가능)
export const createCommentThunk = createAsyncThunk('comments/createComment', async (commentData, { rejectWithValue }) => {
   try {
      const response = await createComment(commentData)

      return response.comment // ✅ API 응답에서 comment 데이터만 반환
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '댓글 등록 실패')
   }
})

export const fetchCommentsThunk = createAsyncThunk('comments/fetchComments', async ({ postId, page, limit }, { rejectWithValue }) => {
   try {
      // 🔥 `postId`가 `undefined`이거나 숫자로 변환할 수 없는 경우 방어 코드 추가
      if (!postId || isNaN(parseInt(postId, 10))) {
         console.error('❌ fetchCommentsThunk 실행 중 postId가 잘못됨:', postId)
         return rejectWithValue('유효하지 않은 postId입니다.')
      }

      const numericPostId = parseInt(postId, 10)

      const response = await fetchComments({ postId: numericPostId, page, limit })

      return {
         comments: response.comments, // ✅ 댓글 데이터
         totalPages: response.totalPages, // ✅ 총 페이지 수 (백엔드에서 전달)
         currentPage: page, // ✅ 현재 페이지 정보 추가
      }
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

// 댓글 채택 Thunk
export const selectCommentThunk = createAsyncThunk('comments/selectComment', async (id, { rejectWithValue }) => {
   try {
      const response = await selectComment(id) // 🔥 위에서 만든 selectComment API 호출
      return response // ✅ 채택된 댓글 반환
   } catch (err) {
      return rejectWithValue(err.response?.data?.message || '댓글 채택 실패')
   }
})

//  Redux Slice 생성
const commentSlice = createSlice({
   name: 'comments',
   initialState: {
      comments: [], // 댓글 리스트
      comment: null, // 특정 댓글 상세 정보
      totalPages: 1,
      currentPage: 1,
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
            state.comments = [action.payload, ...state.comments] // ✅ 최신 댓글을 맨 위로 추가 두 항목 거꾸로 바꾸면 입력순으로 쌓임
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
            state.totalPages = action.payload.totalPages
            state.currentPage = action.payload.currentPage
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
            state.comments = state.comments.map((comment) => (comment.id === action.payload.id ? action.payload : comment))
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
      // ✅ 댓글 채택 처리
      builder
         .addCase(selectCommentThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(selectCommentThunk.fulfilled, (state, action) => {
            state.loading = false
            const updatedComment = action.payload
            // ✅ 기존 댓글 리스트에서 selected 값 유지하면서 업데이트
            const updatedComments = state.comments.map(
               (c) =>
                  c.id === updatedComment.id
                     ? { ...updatedComment, selected: true } // ✅ 채택된 댓글 유지
                     : { ...c, selected: false } // ✅ 다른 댓글은 selected 해제
            )

            // ✅ selected = true인 댓글을 최상단으로 정렬
            state.comments = [...updatedComments].sort((a, b) => (b.selected ? 1 : -1))
         })
         .addCase(selectCommentThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default commentSlice.reducer
