// groupmemberApi.js (프론트엔드 API 요청)
import studymingApi from './axiosApi'

// 그룹 멤버 가입
export const createGroupMember = async (groupId) => {
   try {
      const response = await studymingApi.post(`/groupmember/${groupId}`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 그룹 멤버 상태 변경 (참여)
export const participateInGroup = async (groupId, status) => {
   try {
      const response = await studymingApi.patch(`/groupmember/participate/${groupId}`, { status }) // PUT을 PATCH로 변경
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 그룹 멤버 탈퇴
export const deleteGroupMember = async (groupId, userId) => {
   try {
      const response = await studymingApi.delete(`/groupmember/${groupId}/${userId}`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 그룹 멤버 정보 업데이트
export const updateGroupMember = async (groupId, userId, updateData) => {
   try {
      const response = await studymingApi.put(`/groupmember/${groupId}/${userId}`, updateData)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 그룹 멤버 전체 불러오기
export const getGroupMembers = async (groupId) => {
   try {
      const response = await studymingApi.get(`/groupmember/${groupId}`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 그룹 멤버 특정인 불러오기
export const getGroupMemberById = async (groupId, userId) => {
   try {
      const response = await studymingApi.get(`/groupmember/${groupId}/${userId}`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}
