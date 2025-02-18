/* 경희 */
import studymingApi from './axiosApi'

// D-day API 경로
const API_URL = '/dDay'

// 모든 D-day 불러오기
export const getDdays = async () => {
   try {
      const res = await studymingApi.get(API_URL)
      return res.data
   } catch (error) {
      console.error('D-day 가져오기 실패:', error)
      return []
   }
}

// 새로운 D-day 추가
export const addDday = async (dday) => {
   try {
      const res = await studymingApi.post(API_URL, dday)
      return res.data
   } catch (error) {
      console.error('D-day 추가 실패:', error)
      return null
   }
}

// D-day 수정
export const updateDday = async (id, updatedDday) => {
   try {
      await studymingApi.put(`${API_URL}/${id}`, updatedDday)
   } catch (error) {
      console.error('D-day 수정 실패:', error)
   }
}

// D-day 삭제
export const deleteDday = async (id) => {
   try {
      await studymingApi.delete(`${API_URL}/${id}`)
   } catch (error) {
      console.error('D-day 삭제 실패:', error)
   }
}
