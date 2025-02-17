/* 경희 */
import axios from 'axios'

// ✅ 환경변수에서 API URL 가져오기
const API_URL = process.env.REACT_APP_API_URL + '/dDay'

console.log('📌 API_URL:', API_URL) // ✅ 디버깅용 로그

// ✅ 모든 D-day 불러오기
export const getDdays = async () => {
   try {
      const res = await axios.get(API_URL)
      return res.data
   } catch (error) {
      console.error('❌ D-day 가져오기 실패:', error)
      return []
   }
}

// ✅ 새로운 D-day 추가
export const addDday = async (dday) => {
   try {
      const res = await axios.post(API_URL, dday)
      return res.data
   } catch (error) {
      console.error('D-day 추가 실패:', error)
      return null
   }
}

// ✅ D-day 수정
export const updateDday = async (id, updatedDday) => {
   try {
      await axios.put(`${API_URL}/${id}`, updatedDday)
   } catch (error) {
      console.error('D-day 수정 실패:', error)
   }
}

// ✅ D-day 삭제
export const deleteDday = async (id) => {
   try {
      await axios.delete(`${API_URL}/${id}`)
   } catch (error) {
      console.error('D-day 삭제 실패:', error)
   }
}
