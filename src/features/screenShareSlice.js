// src/features/screenShareSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { updateScreenShareStatus, fetchActivePeers } from '../api/screenShareApi'

export const updateScreenShareStatusThunk = createAsyncThunk('screenShare/updateStatus', async ({ groupId, userId, shareState }, { rejectWithValue }) => {
   try {
      const response = await updateScreenShareStatus(groupId, userId, shareState)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data || '화면 공유 상태 업데이트 실패')
   }
})

export const fetchActivePeersThunk = createAsyncThunk('screenShare/fetchActivePeers', async (groupId, { rejectWithValue }) => {
   try {
      const response = await fetchActivePeers(groupId)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data || '활성 피어 조회 실패')
   }
})

const screenShareSlice = createSlice({
   name: 'screenShare',
   initialState: {
      isSharing: false,
      activePeers: [],
      remoteStreams: {},
      loading: false,
      error: null,
   },
   reducers: {
      setIsSharing: (state, action) => {
         state.isSharing = action.payload
      },
      addRemoteStream: (state, action) => {
         const { userId, stream } = action.payload
         state.remoteStreams[userId] = stream
      },
      removeRemoteStream: (state, action) => {
         const userId = action.payload
         delete state.remoteStreams[userId]
      },
      clearRemoteStreams: (state) => {
         state.remoteStreams = {}
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(updateScreenShareStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateScreenShareStatusThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(updateScreenShareStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
         .addCase(fetchActivePeersThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchActivePeersThunk.fulfilled, (state, action) => {
            state.loading = false
            state.activePeers = action.payload.peers || []
         })
         .addCase(fetchActivePeersThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { setIsSharing, addRemoteStream, removeRemoteStream, clearRemoteStreams } = screenShareSlice.actions

export default screenShareSlice.reducer
