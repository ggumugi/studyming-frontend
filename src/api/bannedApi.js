import studymingApi from './axiosApi'

// ✅ 신고하기 API
export const reportUser = async (reportedUserId, reporterId, reason) => {
   try {
      const response = await studymingApi.post('/banned/report', { reportedUserId, reporterId, reason })
      return response.data
   } catch (error) {
      throw error.response?.data || '신고 요청 실패'
   }
}

// ✅ 신고 목록 불러오기 API
export const fetchReports = async () => {
   try {
      const response = await studymingApi.get('/banned/reports')
      return response.data
   } catch (error) {
      throw error.response?.data || '신고 목록 불러오기 실패'
   }
}

// ✅ 벤 적용 API
export const banUser = async (reportId, adminId, banDays) => {
   try {
      const response = await studymingApi.post('/banned/ban', { reportId, adminId, banDays })
      return response.data
   } catch (error) {
      throw error.response?.data || '벤 적용 실패'
   }
}

// ✅ 벤 목록 불러오기 API
export const fetchBannedUsers = async () => {
   try {
      const response = await studymingApi.get('/banned/banned-users')
      return response.data
   } catch (error) {
      throw error.response?.data || '벤 목록 불러오기 실패'
   }
}

// ✅ 벤 해제 API
export const unbanUser = async (userId) => {
   try {
      const response = await studymingApi.post('/banned/unban', { userId })
      return response.data
   } catch (error) {
      throw error.response?.data || '벤 해제 실패'
   }
}
