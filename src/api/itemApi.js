import studymingApi from './axiosApi'

// ✅ 아이템 등록 API
export const createItem = async (itemData) => {
   try {
      console.log('📌 API 요청 데이터:', [...itemData.entries()]) // ✅ FormData 확인

      const response = await studymingApi.post('/item', itemData, {
         headers: { 'Content-Type': 'multipart/form-data' }, // ✅ 파일 업로드 필수!
      })

      return response.data
   } catch (error) {
      console.error('❌ API 요청 오류:', error.response?.data || error.message) // ✅ 에러 확인
      return { error: error.response?.data?.message || '아이템 등록 실패' }
   }
}

// ✅ 아이템 목록 조회 API
export const getItems = async () => {
   try {
      const response = await studymingApi.get('/item')
      return response.data
   } catch (error) {
      return { error: error.response?.data?.message || '아이템 조회 실패' }
   }
}
