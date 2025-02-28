// features/screenShareSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { updateScreenShareStatus, getGroupScreenShareStatus, getActivePeers } from '../api/screenShareApi'

// 화면 공유 상태 업데이트 액션
export const updateScreenShareStatusThunk = createAsyncThunk('screenShare/updateStatus', async ({ groupId, userId, shareState }, { rejectWithValue }) => {
   try {
      const response = await updateScreenShareStatus({ groupId, userId, shareState })
      return response.groupmember
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '화면 공유 상태 업데이트 실패')
   }
})

// 그룹의 화면 공유 상태 조회 액션
export const fetchGroupScreenShareStatusThunk = createAsyncThunk('screenShare/fetchStatus', async (groupId, { rejectWithValue }) => {
   try {
      const response = await getGroupScreenShareStatus(groupId)
      return response.groupmembers
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '그룹 화면 공유 상태 조회 실패')
   }
})

// 활성 피어 목록 조회 액션
export const fetchActivePeersThunk = createAsyncThunk('screenShare/fetchPeers', async (groupId, { rejectWithValue }) => {
   try {
      const response = await getActivePeers(groupId)
      return response.peers
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '활성 피어 목록 조회 실패')
   }
})

// 슬라이스 생성
const screenShareSlice = createSlice({
   name: 'screenShare',
   initialState: {
      isSharing: false,
      participants: [],
      activePeers: [],
      loading: false,
      error: null,
   },
   reducers: {
      setIsSharing: (state, action) => {
         state.isSharing = action.payload
      },
      addParticipant: (state, action) => {
         const { participant } = action.payload
         if (!state.participants.find((p) => p.id === participant.id)) {
            state.participants.push(participant)
         }
      },
      removeParticipant: (state, action) => {
         const { participantId } = action.payload
         state.participants = state.participants.filter((p) => p.id !== participantId)
      },
      updateParticipantShareState: (state, action) => {
         const { participantId, shareState } = action.payload
         const participant = state.participants.find((p) => p.id === participantId)
         if (participant) {
            participant.shareState = shareState
         }
      },
      clearParticipants: (state) => {
         state.participants = []
      },
   },
   extraReducers: (builder) => {
      // 화면 공유 상태 업데이트
      builder
         .addCase(updateScreenShareStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateScreenShareStatusThunk.fulfilled, (state, action) => {
            state.loading = false

            // 자신의 화면 공유 상태 업데이트
            if (action.meta.arg.userId === action.payload.userId) {
               state.isSharing = action.payload.shareState
            }

            // 참가자 목록에서 해당 사용자 찾아 상태 업데이트
            const participantIndex = state.participants.findIndex((p) => p.id === action.payload.userId)

            if (participantIndex !== -1) {
               state.participants[participantIndex].shareState = action.payload.shareState
            }
         })
         .addCase(updateScreenShareStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 그룹의 화면 공유 상태 조회
      builder
         .addCase(fetchGroupScreenShareStatusThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchGroupScreenShareStatusThunk.fulfilled, (state, action) => {
            state.loading = false

            // 참가자 정보 업데이트
            state.participants = action.payload.map((member) => ({
               id: member.userId,
               nickname: member.User ? member.User.nickname : `사용자 ${member.userId}`,
               role: member.role,
               status: member.status,
               shareState: member.shareState,
               camState: member.camState,
               voiceState: member.voiceState,
            }))
         })
         .addCase(fetchGroupScreenShareStatusThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 활성 피어 목록 조회
      builder
         .addCase(fetchActivePeersThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchActivePeersThunk.fulfilled, (state, action) => {
            state.loading = false
            state.activePeers = action.payload
         })
         .addCase(fetchActivePeersThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { setIsSharing, addParticipant, removeParticipant, updateParticipantShareState, clearParticipants } = screenShareSlice.actions

export default screenShareSlice.reducer
