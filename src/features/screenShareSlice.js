import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiUpdateScreenShareStatus, apiGetChannelInfo, apiUpdateChannelInfo, initiateScreenShare, terminateScreenShare, cleanupScreenShareResources, joinSocketRoom } from '../api/screenShareApi'

// 화면 공유 상태 업데이트
export const updateScreenShareStatusThunk = createAsyncThunk('screenShare/updateStatus', async ({ groupId, userId, shareState }, { rejectWithValue }) => {
   try {
      const response = await apiUpdateScreenShareStatus(groupId, userId, shareState)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '화면 공유 상태 업데이트 실패')
   }
})

// 채널 정보 가져오기
export const getChannelInfoThunk = createAsyncThunk('screenShare/getChannelInfo', async (groupId, { rejectWithValue }) => {
   try {
      const response = await apiGetChannelInfo(groupId)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '채널 정보 가져오기 실패')
   }
})

// 채널 정보 업데이트
export const updateChannelInfoThunk = createAsyncThunk('screenShare/updateChannelInfo', async ({ groupId, sharedChannel }, { rejectWithValue }) => {
   try {
      const response = await apiUpdateChannelInfo(groupId, sharedChannel)
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '채널 정보 업데이트 실패')
   }
})

// 화면 공유 시작
export const startScreenShareThunk = createAsyncThunk('screenShare/start', async ({ roomId, groupMembers }, { dispatch, rejectWithValue }) => {
   try {
      // 방 입장
      joinSocketRoom(roomId)

      // 화면 공유 시작
      const stream = await initiateScreenShare(roomId, groupMembers, dispatch, {
         addStreamToState,
         removeStreamFromState,
         setScreenShareActive,
         setScreenShareInactive,
         clearAllStreams,
         addParticipant, // 이 액션을 추가
         removeParticipant, // 이 액션도 추가
      })

      return { success: true, stream }
   } catch (error) {
      console.error('화면 공유 시작 실패:', error)
      return rejectWithValue(error.message || '화면 공유를 시작할 수 없습니다.')
   }
})

// 화면 공유 중지
export const stopScreenShareThunk = createAsyncThunk('screenShare/stop', async (_, { dispatch, rejectWithValue }) => {
   try {
      terminateScreenShare(dispatch, {
         setScreenShareInactive,
         removeStreamFromState,
      })
      return { success: true }
   } catch (error) {
      return rejectWithValue(error.message || '화면 공유 중지 실패')
   }
})

// 연결 정리
export const cleanupConnectionThunk = createAsyncThunk('screenShare/cleanup', async (_, { dispatch, rejectWithValue }) => {
   try {
      cleanupScreenShareResources(dispatch, {
         clearAllStreams,
      })
      return { success: true }
   } catch (error) {
      return rejectWithValue(error.message || '연결 정리 실패')
   }
})

// 슬라이스 생성
const screenShareSlice = createSlice({
   name: 'screenShare',
   initialState: {
      streams: {},
      participants: [],
      isSharing: false,
      channelInfo: null,
      loading: false,
      error: null,
   },
   reducers: {
      // 참가자 목록 설정
      setInitialParticipants: (state, action) => {
         state.participants = action.payload
      },
      // 참가자 추가
      addParticipant: (state, action) => {
         if (!state.participants.find((p) => p.id === action.payload.id)) {
            state.participants.push(action.payload)
         }
      },
      // 참가자 제거
      removeParticipant: (state, action) => {
         state.participants = state.participants.filter((participant) => participant.id !== action.payload)
      },
      // 스트림 추가
      addStreamToState: (state, action) => {
         const { userId, stream } = action.payload
         state.streams = {
            ...state.streams,
            [userId]: stream,
         }
      },
      // 스트림 제거
      removeStreamFromState: (state, action) => {
         const { userId } = action.payload
         const newStreams = { ...state.streams }
         delete newStreams[userId]
         state.streams = newStreams
      },
      // 화면 공유 시작
      setScreenShareActive: (state) => {
         state.isSharing = true
      },
      // 화면 공유 중지
      setScreenShareInactive: (state) => {
         state.isSharing = false
      },
      // 모든 스트림 초기화
      clearAllStreams: (state) => {
         state.streams = {}
         state.isSharing = false
      },
   },
   extraReducers: (builder) => {
      // 화면 공유 상태 업데이트
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

      // 채널 정보 가져오기
      builder
         .addCase(getChannelInfoThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(getChannelInfoThunk.fulfilled, (state, action) => {
            state.loading = false
            state.channelInfo = action.payload.channel
         })
         .addCase(getChannelInfoThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 채널 정보 업데이트
      builder
         .addCase(updateChannelInfoThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(updateChannelInfoThunk.fulfilled, (state, action) => {
            state.loading = false
            state.channelInfo = action.payload.channel
         })
         .addCase(updateChannelInfoThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 화면 공유 시작
      builder
         .addCase(startScreenShareThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(startScreenShareThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(startScreenShareThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 화면 공유 중지
      builder
         .addCase(stopScreenShareThunk.pending, (state) => {
            state.loading = true
         })
         .addCase(stopScreenShareThunk.fulfilled, (state) => {
            state.loading = false
         })
         .addCase(stopScreenShareThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export const { setInitialParticipants, addParticipant, removeParticipant, addStreamToState, removeStreamFromState, setScreenShareActive, setScreenShareInactive, clearAllStreams } = screenShareSlice.actions

export default screenShareSlice.reducer
