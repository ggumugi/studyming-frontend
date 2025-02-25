import studymingApi from './axiosApi'

// ✅ 아이템 등록 API
export const createItem = async (itemData) => {
   try {
      console.log('📌 API 요청 데이터:', [...itemData.entries()]) // ✅ FormData 확인
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data', // 파일 전송시 반드시 지정
         },
      }

      const response = await studymingApi.post('/item', itemData, config)

      return response.data
   } catch (error) {
      console.error('❌ API 요청 오류:', error.response?.data || error.message) // ✅ 에러 확인
      return { error: error.response?.data?.message || '아이템 등록 실패' }
   }
}

// ✅ 아이템 수정 API
export const updateItem = async (id, updatedData) => {
   try {
      const config = {
         headers: {
            'Content-Type': 'multipart/form-data', // 파일 전송시 반드시 지정
         },
         withCredentials: true, // 🔹 쿠키 포함 (인증 필요)
      }
      const response = await studymingApi.put(`/item/${id}`, updatedData, config)
      return response.data.item
   } catch (error) {
      console.error('❌ 아이템 수정 실패:', error.response?.data || error.message)
      return { error: error.response?.data?.message || '아이템 수정 실패' }
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

// ✅ 사용자의 아이템 목록 불러오기
export const getMyItems = async () => {
   try {
      const response = await studymingApi.get('/item/myitems', { withCredentials: true })
      return response.data.items
   } catch (error) {
      console.error('❌ API 요청 오류 (MyItem):', error.response?.data || error.message)
      return { error: error.response?.data?.message || '아이템 조회 실패' }
   }
}

// ✅ 아이템 삭제 API
export const deleteItem = async (id) => {
   try {
      const response = await studymingApi.delete(`/item/${id}`, { withCredentials: true })
      return response.data
   } catch (error) {
      console.error('❌ 아이템 삭제 오류:', error.response?.data || error.message)
      return { error: error.response?.data?.message || '아이템 삭제 실패' }
   }
}
