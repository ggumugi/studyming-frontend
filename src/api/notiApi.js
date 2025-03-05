import studymingApi from './axiosApi'

// 내 알림(쪽지) 목록 가져오기
export const getNotifications = async () => {
   try {
      const response = await studymingApi.get('/noti')
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 쪽지 보내기
export const sendNotification = async (data) => {
   try {
      const response = await studymingApi.post('/noti', data)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 쪽지 읽음 표시
export const markNotificationAsRead = async (notificationId) => {
   try {
      const response = await studymingApi.patch(`/noti/${notificationId}`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 읽은 쪽지 모두 삭제
export const deleteReadNotifications = async () => {
   try {
      const response = await studymingApi.delete('/noti/read')
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 특정 쪽지 삭제
export const deleteNotification = async (notificationId) => {
   try {
      const response = await studymingApi.delete(`/noti/${notificationId}`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}
