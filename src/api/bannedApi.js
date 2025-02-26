import studymingApi from './axiosApi'

// ✅ 신고하기 API
export const reportUser = async (reportedUserId, reporterId, reason) => {
   try {
      if (!reportedUserId || !reporterId || !reason) {
         throw new Error('신고 요청에 필요한 값이 누락되었습니다.')
      }

      const response = await studymingApi.post('/banned/report', { reportedUserId, reporterId, reason })
      return response.data
   } catch (error) {
      console.error('❌ 신고 요청 실패:', error.response?.data || error.message)
      throw error.response?.data || { message: '신고 요청 실패' }
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
      console.error('❌ 벤 적용 실패:', error)
      throw error.response?.data || '벤 적용 실패'
   }
}

// ✅ 벤 기간 변경 API
export const updateBanPeriod = async (bannedId, newEndDate) => {
   console.log(`🚀 정지 기간 변경 요청: { bannedId: ${bannedId}, newEndDate: '${newEndDate}' }`)
   try {
      const response = await studymingApi.put('/banned/updateban', { bannedId, newEndDate })
      return response.data
   } catch (error) {
      console.error('❌ 정지 기간 변경 실패:', error)
      throw error.response?.data || error.message
   }
}

// ✅ 벤 목록 불러오기 API
export const fetchBannedUsers = async () => {
   try {
      const response = await studymingApi.get('/banned/bannedusers')
      console.log('🚀 Banned Users Fetched:', response.data) // ✅ 데이터 확인 로그
      return response.data
   } catch (error) {
      console.error('❌ 정지된 유저 목록 불러오기 실패:', error)
      throw error.response?.data || '정지된 유저 목록 불러오기 실패'
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
