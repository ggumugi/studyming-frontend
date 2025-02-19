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
      const response = await studymingApi.post('/point/send', data)
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
