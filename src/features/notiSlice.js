import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getNotifications, sendNotification, markNotificationAsRead, deleteReadNotifications, deleteNotification } from '../api/notiApi'

// 알림 목록 가져오기
export const fetchNotificationsThunk = createAsyncThunk('notifications/fetchAll', async (_, { rejectWithValue }) => {
   try {
      const response = await getNotifications()
      return response.data.notifications
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '알림 목록 불러오기 실패')
   }
})

// 쪽지 보내기
export const sendNotificationThunk = createAsyncThunk('notifications/send', async (data, { rejectWithValue }) => {
   try {
      const response = await sendNotification(data)
      return response.data.notification
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '쪽지 전송 실패')
   }
})

// 쪽지 읽음 표시
export const markNotificationAsReadThunk = createAsyncThunk('notifications/markAsRead', async (notificationId, { rejectWithValue }) => {
   try {
      await markNotificationAsRead(notificationId)
      return notificationId
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '쪽지 읽음 표시 실패')
   }
})

// 읽은 쪽지 모두 삭제
export const deleteReadNotificationsThunk = createAsyncThunk('notifications/deleteRead', async (_, { rejectWithValue }) => {
   try {
      const response = await deleteReadNotifications()
      return response.data
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '읽은 쪽지 삭제 실패')
   }
})

// 특정 쪽지 삭제
export const deleteNotificationThunk = createAsyncThunk('notifications/delete', async (notificationId, { rejectWithValue }) => {
   try {
      await deleteNotification(notificationId)
      return notificationId
   } catch (error) {
      return rejectWithValue(error.response?.data?.message || '쪽지 삭제 실패')
   }
})

// 슬라이스 생성
const notiSlice = createSlice({
   name: 'noti',
   initialState: {
      items: [],
      loading: false,
      error: null,
   },
   reducers: {},
   extraReducers: (builder) => {
      // 알림 목록 가져오기
      builder
         .addCase(fetchNotificationsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload
         })
         .addCase(fetchNotificationsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 쪽지 보내기
      builder
         .addCase(sendNotificationThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(sendNotificationThunk.fulfilled, (state, action) => {
            state.loading = false
            // 내가 보낸 쪽지는 목록에 추가하지 않음 (받는 사람의 목록에 추가됨)
         })
         .addCase(sendNotificationThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 쪽지 읽음 표시
      builder
         .addCase(markNotificationAsReadThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(markNotificationAsReadThunk.fulfilled, (state, action) => {
            state.loading = false
            // 해당 ID의 알림을 읽음으로 표시
            const index = state.items.findIndex((item) => item.id === action.payload)
            if (index !== -1) {
               state.items[index].isRead = true
            }
         })
         .addCase(markNotificationAsReadThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 읽은 쪽지 모두 삭제
      builder
         .addCase(deleteReadNotificationsThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteReadNotificationsThunk.fulfilled, (state) => {
            state.loading = false
            // 읽은 쪽지 모두 제거
            state.items = state.items.filter((item) => !item.isRead)
         })
         .addCase(deleteReadNotificationsThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })

      // 특정 쪽지 삭제
      builder
         .addCase(deleteNotificationThunk.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(deleteNotificationThunk.fulfilled, (state, action) => {
            state.loading = false
            // 해당 ID의 알림 제거
            state.items = state.items.filter((item) => item.id !== action.payload)
         })
         .addCase(deleteNotificationThunk.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
         })
   },
})

export default notiSlice.reducer
