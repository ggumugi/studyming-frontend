import studymingApi from './axiosApi'

// 특정 유저의 오늘, 어제 공부 시간 가져오기
export const getTimeData = async (userId) => {
   try {
      const response = await studymingApi.get(`/time/time/${userId}`)
      return response.data
   } catch (error) {
      console.error('Error fetching time data:', error)
      return null
   }
}

// 특정 유저의 총 공부 시간 가져오기
export const getAllTimeData = async (userId) => {
   try {
      const response = await studymingApi.get(`/time/alltime/${userId}`)
      return response.data
   } catch (error) {
      console.error('Error fetching all-time data:', error)
      return null
   }
}
