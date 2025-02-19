/* 경희 */
import studymingApi from './axiosApi'

// Goals API 경로
const API_URL = '/goals'

// 모든 Goals 불러오기
export const getGoals = async () => {
   try {
      const res = await studymingApi.get(API_URL)
      return res.data
   } catch (error) {
      console.error('Goals 가져오기 실패:', error)
      return []
   }
}

// 새로운 Goal 추가
export const addGoal = async (goal) => {
   try {
      const res = await studymingApi.post(API_URL, goal)
      return res.data
   } catch (error) {
      console.error('Goal 추가 실패:', error)
      return null
   }
}

// Goal 수정
export const updateGoal = async (id, updatedGoal) => {
   try {
      await studymingApi.put(`${API_URL}/${id}`, updatedGoal)
   } catch (error) {
      console.error('Goal 수정 실패:', error)
   }
}

// Goal 삭제
export const deleteGoal = async (id) => {
   try {
      await studymingApi.delete(`${API_URL}/${id}`)
   } catch (error) {
      console.error('Goal 삭제 실패:', error)
   }
}
