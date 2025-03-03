// src/api/screenShareApi.js
import studymingApi from './axiosApi'

// 화면 공유 상태 업데이트
export const updateScreenShareStatus = async (groupId, userId, shareState) => {
   try {
      const response = await studymingApi.patch('/screenShare/status', {
         groupId,
         userId,
         shareState,
      })
      return response
   } catch (error) {
      console.error('화면 공유 상태 업데이트 실패:', error)
      throw error
   }
}

// 활성 피어 목록 조회
export const fetchActivePeers = async (groupId) => {
   try {
      const response = await studymingApi.get(`/screenShare/peers/${groupId}`)
      return response
   } catch (error) {
      console.error('활성 피어 목록 조회 실패:', error)
      throw error
   }
}

// 피어 연결 상태 로깅
export const logPeerConnectionStatus = (peerId, status, details = {}) => {
   console.log(`[Peer ${peerId}] ${status}`, details)
   // 필요한 경우 서버에 로그를 전송할 수도 있습니다
   // studymingApi.post('/screenShare/logs', { peerId, status, details });
}

// 그룹의 화면 공유 상태 조회
export const getGroupScreenShareStatus = async (groupId) => {
   try {
      const response = await studymingApi.get(`/screenShare/status/${groupId}`)
      return response
   } catch (error) {
      console.error('그룹 화면 공유 상태 조회 실패:', error)
      throw error
   }
}
