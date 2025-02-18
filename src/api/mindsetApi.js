/* 경희 */
import studymingApi from './axiosApi'

// mindset API 경로
const API_URL = '/mindset'

// 모든 mindset 불러오기
export const getMindset = async () => {
   try {
      const res = await studymingApi.get(API_URL)
      return res.data
   } catch (error) {
      console.error('mindset 가져오기 실패:', error)
      return []
   }
}

// 새로운 mindset 추가
export const addMindset = async (mindset) => {
   try {
      const res = await studymingApi.post(API_URL, mindset)
      return res.data
   } catch (error) {
      console.error('mindset 추가 실패:', error)
      return null
   }
}

// mindset 수정
export const updateMindset = async (id, updatedMindset) => {
   try {
      await studymingApi.put(`${API_URL}/${id}`, updatedMindset)
   } catch (error) {
      console.error('mindset 수정 실패:', error)
   }
}

// mindset 삭제
export const deleteMindset = async (id) => {
   try {
      await studymingApi.delete(`${API_URL}/${id}`)
   } catch (error) {
      console.error('mindset 삭제 실패:', error)
   }
}
