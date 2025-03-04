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
// 방장 위임
export const transferGroupLeader = async (groupId, newLeaderId) => {
   try {
      console.log(`API 요청 - groupId: ${groupId}, newLeaderId: ${newLeaderId}`)
      const response = await studymingApi.put(`/groupmember/${groupId}`, { newLeaderId })
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 멤버 강퇴
export const kickGroupMember = async (groupId, userId) => {
   try {
      console.log('🔥 API 요청 - groupId:', groupId, 'userId:', userId) // ✅ 확인용
      const response = await studymingApi.delete(`/groupmember/${groupId}/${userId}`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 로그인한 유저의 참여 중인 스터디 목록 가져오기
export const getUserStudyGroups = async () => {
   try {
      const response = await studymingApi.get('/groupmember/user') // 백엔드 API 요청
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}
