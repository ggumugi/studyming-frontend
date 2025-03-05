import studymingApi from './axiosApi'

// 포인트 조회 API
export const getUserPoints = async () => {
   try {
      const response = await studymingApi.get('/point')
      return response
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

// 포인트 사용 API (상품 구매)
export const usePointsForItem = async (itemId) => {
   try {
      const response = await studymingApi.post('/point', { itemId })
      return response
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

// 포인트 선물 API
export const sendPoints = async (data) => {
   try {
      const response = await studymingApi.post('/point/send', {
         receiverNickname: data.receiverNickname, // 닉네임으로 요청
         amount: data.amount,
      })
      return response
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

// 포인트 변동 내역 조회 API
export const getPointHistory = async () => {
   try {
      const response = await studymingApi.get('/point/history')
      return response
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

// ✅ 카드 결제 후 포인트 충전 API
export const chargePoints = async (imp_uid, amount) => {
   try {
      const response = await studymingApi.post('/point/charge', { imp_uid, amount })
      return response.data
   } catch (error) {
      console.error(`❌ 포인트 충전 오류: ${error.message}`)
      throw error
   }
}
