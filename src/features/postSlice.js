import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchPosts, fetchPostById, createPost, updatePost, deletePost } from '../api/postApi'

// 비동기 액션 생성
export const getPosts = createAsyncThunk('posts/getPosts', async (category) => {
   return await fetchPosts(category)
})

export const getPost = createAsyncThunk('posts/getPost', async (id) => {
   return await fetchPostById(id)
})

export const addPost = createAsyncThunk('posts/addPost', async (postData) => {
   return await createPost(postData)
})

export const editPost = createAsyncThunk('posts/editPost', async ({ id, postData }) => {
   return await updatePost(id, postData)
})

export const removePost = createAsyncThunk('posts/removePost', async (id) => {
   return await deletePost(id)
})

// Redux Slice
const postSlice = createSlice({
   name: 'posts',
   initialState: {
      list: [],
      currentPost: null,
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(getPosts.pending, (state) => {
            state.loading = true
         })
         .addCase(getPosts.fulfilled, (state, action) => {
            state.loading = false
            state.list = action.payload
         })
         .addCase(getPosts.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })
         .addCase(getPost.fulfilled, (state, action) => {
            state.currentPost = action.payload
         })
         .addCase(addPost.fulfilled, (state, action) => {
            state.list.push(action.payload)
         })
         .addCase(editPost.fulfilled, (state, action) => {
            const index = state.list.findIndex((post) => post.id === action.payload.id)
            if (index !== -1) state.list[index] = action.payload
         })
         .addCase(removePost.fulfilled, (state, action) => {
            state.list = state.list.filter((post) => post.id !== action.meta.arg)
         })
   },
})

export default postSlice.reducer
