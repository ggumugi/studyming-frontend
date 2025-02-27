import studymingApi from './axiosApi'
import io from 'socket.io-client'

// 소켓 서버 URL - 8002 대신 8000 사용
const SOCKET_SERVER_URL = 'http://localhost:8000'

// 전역 변수
let socket = null
let peerConnections = {}
let localStream = null

// API 호출 함수들
export const apiUpdateScreenShareStatus = async (groupId, userId, shareState) => {
   try {
      const response = await studymingApi.put(`/screenShare/status/${groupId}/${userId}`, { shareState })
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

export const apiGetChannelInfo = async (groupId) => {
   try {
      const response = await studymingApi.get(`/screenShare/channel/${groupId}`)
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

export const apiUpdateChannelInfo = async (groupId, sharedChannel) => {
   try {
      const response = await studymingApi.put(`/screenShare/channel/${groupId}`, { sharedChannel })
      return response
   } catch (error) {
      console.error(`API 오류: ${error.message}`)
      throw error
   }
}

// 소켓 및 WebRTC 관련 함수들
export const initSocketConnection = () => {
   if (!socket) {
      socket = io(SOCKET_SERVER_URL, {
         reconnection: true,
         reconnectionAttempts: 5,
         reconnectionDelay: 1000,
         transports: ['websocket', 'polling'],
      })

      console.log('소켓 연결 초기화:', SOCKET_SERVER_URL)

      socket.on('connect', () => {
         console.log('소켓 연결 성공:', socket.id)
         window.socketId = socket.id

         // 소켓 ID를 화면에 표시 (디버깅용)
         const socketIdDisplay = document.createElement('div')
         socketIdDisplay.style.position = 'fixed'
         socketIdDisplay.style.top = '10px'
         socketIdDisplay.style.left = '10px'
         socketIdDisplay.style.background = 'rgba(0,0,0,0.7)'
         socketIdDisplay.style.color = 'white'
         socketIdDisplay.style.padding = '5px'
         socketIdDisplay.style.zIndex = '9999'
         socketIdDisplay.style.fontSize = '12px'
         socketIdDisplay.textContent = `Socket ID: ${socket.id}`
         document.body.appendChild(socketIdDisplay)
      })

      socket.on('connect_error', (error) => {
         console.error('소켓 연결 오류:', error)
      })

      socket.on('disconnect', (reason) => {
         console.log('소켓 연결 해제:', reason)
      })
   }
   return socket
}

export const joinSocketRoom = (roomId) => {
   if (!socket) initSocketConnection()

   console.log(`방 ${roomId}에 입장 요청, 소켓 ID: ${socket.id || '미정'}`)
   socket.emit('join_room', { roomId })

   // 방 ID를 화면에 표시 (디버깅용)
   const roomIdDisplay = document.createElement('div')
   roomIdDisplay.style.position = 'fixed'
   roomIdDisplay.style.top = '30px'
   roomIdDisplay.style.left = '10px'
   roomIdDisplay.style.background = 'rgba(0,0,0,0.7)'
   roomIdDisplay.style.color = 'white'
   roomIdDisplay.style.padding = '5px'
   roomIdDisplay.style.zIndex = '9999'
   roomIdDisplay.style.fontSize = '12px'
   roomIdDisplay.textContent = `Room ID: ${roomId}`
   document.body.appendChild(roomIdDisplay)
}

export const initiateScreenShare = async (roomId, groupMembers, dispatch, actions) => {
   try {
      // 화면 공유 스트림 생성
      const stream = await navigator.mediaDevices.getDisplayMedia({
         video: { cursor: 'always' },
         audio: false,
      })

      console.log('화면 공유 스트림 생성 성공:', stream)

      // 로컬 스트림 저장
      localStream = stream

      // 자신의 스트림 상태에 추가
      const currentUserId = window.socketId || 'local'
      dispatch(actions.addStreamToState({ userId: currentUserId, stream }))
      dispatch(actions.setScreenShareActive())

      // 화면 공유 시작 알림
      if (!socket) initSocketConnection()
      socket.emit('screen_share_started', { roomId })

      // 다른 사용자들과 연결
      createPeerConnections(roomId, groupMembers, dispatch, actions)

      // 스트림 종료 이벤트 처리
      stream.getVideoTracks()[0].onended = () => {
         terminateScreenShare(dispatch, actions)
      }

      // 방 정보 요청 - 새로 추가
      socket.emit('get_room_info', { roomId })

      return { success: true }
   } catch (error) {
      console.error('화면 공유 시작 실패:', error)
      throw error
   }
}

export const terminateScreenShare = (dispatch, actions) => {
   if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      localStream = null
   }

   // 모든 피어 연결 종료
   Object.values(peerConnections).forEach((pc) => {
      if (pc) pc.close()
   })

   peerConnections = {}

   // 화면 공유 비활성화
   dispatch(actions.setScreenShareInactive())

   // 현재 사용자의 스트림만 제거 (다른 사용자의 스트림은 유지)
   const currentUserId = window.socketId || 'local'
   dispatch(actions.removeStreamFromState({ userId: currentUserId }))
}

export const cleanupScreenShareResources = (dispatch, actions) => {
   // 스트림 정리
   if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      localStream = null
   }

   // 피어 연결 정리
   Object.values(peerConnections).forEach((pc) => {
      if (pc) pc.close()
   })
   peerConnections = {}

   // 소켓 연결 정리
   if (socket) {
      socket.off('user-joined')
      socket.off('offer')
      socket.off('answer')
      socket.off('candidate')
      socket.off('user-left')
      socket.off('room_info')
      socket.off('signaling_error')
   }

   // 상태 초기화
   if (dispatch && actions) {
      dispatch(actions.clearAllStreams())
   }
}

// 디버깅 및 테스트 함수 - 새로 추가
export const debugSocketInfo = () => {
   if (!socket) {
      console.warn('소켓이 초기화되지 않았습니다.')
      return
   }

   console.log('소켓 정보:')
   console.log('- ID:', socket.id)
   console.log('- 연결 상태:', socket.connected ? '연결됨' : '연결 안됨')
   console.log('- 네임스페이스:', socket.nsp)

   // 현재 참여 중인 방 목록
   console.log('- 참여 중인 방:', Array.from(socket.rooms || []))

   // 모든 피어 연결 상태
   console.log('피어 연결 상태:')
   Object.keys(peerConnections).forEach((peerId) => {
      const pc = peerConnections[peerId]
      console.log(`- ${peerId}:`, {
         iceConnectionState: pc.iceConnectionState,
         signalingState: pc.signalingState,
         connectionState: pc.connectionState,
      })
   })

   // 디버그 정보를 화면에 표시
   const debugInfo = document.createElement('div')
   debugInfo.style.position = 'fixed'
   debugInfo.style.top = '50px'
   debugInfo.style.left = '10px'
   debugInfo.style.background = 'rgba(0,0,0,0.9)'
   debugInfo.style.color = 'white'
   debugInfo.style.padding = '10px'
   debugInfo.style.zIndex = '10000'
   debugInfo.style.fontSize = '12px'
   debugInfo.style.maxWidth = '400px'
   debugInfo.style.maxHeight = '300px'
   debugInfo.style.overflow = 'auto'

   let infoText = `<h3>디버그 정보</h3>`
   infoText += `<p>소켓 ID: ${socket.id}</p>`
   infoText += `<p>연결 상태: ${socket.connected ? '연결됨' : '연결 안됨'}</p>`
   infoText += `<p>피어 연결 수: ${Object.keys(peerConnections).length}</p>`

   Object.keys(peerConnections).forEach((peerId) => {
      const pc = peerConnections[peerId]
      infoText += `<p>피어 ${peerId}: ${pc.iceConnectionState} / ${pc.signalingState}</p>`
   })

   debugInfo.innerHTML = infoText

   // 이전 디버그 정보 제거
   const oldDebugInfo = document.querySelector('#debug-info')
   if (oldDebugInfo) {
      oldDebugInfo.remove()
   }

   debugInfo.id = 'debug-info'
   document.body.appendChild(debugInfo)

   // 5초 후 자동 제거
   setTimeout(() => {
      debugInfo.remove()
   }, 5000)
}

// 시그널링 테스트 함수 - 새로 추가
export const testSignaling = (roomId) => {
   if (!socket) initSocketConnection()

   console.log('시그널링 테스트 시작')

   // 테스트 메시지 전송
   socket.emit('test_signal', {
      roomId,
      message: '테스트 메시지',
      timestamp: new Date().toISOString(),
      from: socket.id,
   })

   // 테스트 메시지 수신 처리
   socket.off('test_signal_response')
   socket.on('test_signal_response', (data) => {
      console.log('테스트 시그널 응답 수신:', data)

      // 응답이 다른 클라이언트에서 왔는지 확인
      if (data.from !== socket.id) {
         console.log('다른 클라이언트에서 응답이 왔습니다.')

         // 성공 메시지 표시
         const successMessage = document.createElement('div')
         successMessage.style.position = 'fixed'
         successMessage.style.top = '50%'
         successMessage.style.left = '50%'
         successMessage.style.transform = 'translate(-50%, -50%)'
         successMessage.style.background = 'rgba(0,128,0,0.8)'
         successMessage.style.color = 'white'
         successMessage.style.padding = '20px'
         successMessage.style.borderRadius = '5px'
         successMessage.style.zIndex = '10000'
         successMessage.style.fontSize = '16px'
         successMessage.textContent = `시그널링 테스트 성공! 상대방 ID: ${data.from}`
         document.body.appendChild(successMessage)

         // 3초 후 메시지 제거
         setTimeout(() => {
            successMessage.remove()
         }, 3000)
      }
   })
}

// 내부 헬퍼 함수들
const createPeerConnections = (roomId, groupMembers, dispatch, actions) => {
   if (!socket) initSocketConnection()

   // 각 멤버에 대해 RTCPeerConnection 생성
   groupMembers.forEach((member) => {
      if (member.id === socket.id) return // 자신은 제외

      createPeerConnection(roomId, member.id, dispatch, actions)
   })

   // 소켓 이벤트 리스너 등록
   setupSocketListeners(roomId, dispatch, actions)

   // 방 정보 수신 리스너 추가 - 새로 추가
   socket.on('room_info', (data) => {
      console.log('방 정보 수신:', data)
      const { members } = data

      // 자신을 제외한 다른 멤버들과 연결
      members.forEach((memberId) => {
         if (memberId !== socket.id && !peerConnections[memberId]) {
            console.log(`방 정보에서 새 멤버 발견: ${memberId}`)
            createPeerConnection(roomId, memberId, dispatch, actions)
         }
      })
   })

   // 시그널링 오류 처리 - 새로 추가
   socket.on('signaling_error', (data) => {
      console.error('시그널링 오류:', data)

      // 오류 메시지 표시
      const errorMessage = document.createElement('div')
      errorMessage.style.position = 'fixed'
      errorMessage.style.top = '50%'
      errorMessage.style.left = '50%'
      errorMessage.style.transform = 'translate(-50%, -50%)'
      errorMessage.style.background = 'rgba(255,0,0,0.8)'
      errorMessage.style.color = 'white'
      errorMessage.style.padding = '20px'
      errorMessage.style.borderRadius = '5px'
      errorMessage.style.zIndex = '10000'
      errorMessage.style.fontSize = '16px'
      errorMessage.textContent = `시그널링 오류: ${data.message}`
      document.body.appendChild(errorMessage)

      // 3초 후 메시지 제거
      setTimeout(() => {
         errorMessage.remove()
      }, 3000)
   })
}

const createPeerConnection = (roomId, memberId, dispatch, actions) => {
   console.log(`피어 연결 생성 시작: ${memberId}, 내 ID: ${socket.id}`)

   // 이미 연결이 있으면 재사용
   if (peerConnections[memberId]) {
      console.log(`기존 피어 연결 사용: ${memberId}`)
      return peerConnections[memberId]
   }

   const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }, { urls: 'stun:stun2.l.google.com:19302' }, { urls: 'stun:stun3.l.google.com:19302' }, { urls: 'stun:stun4.l.google.com:19302' }],
   })

   // 연결 상태 변화 이벤트 처리
   peerConnection.oniceconnectionstatechange = () => {
      const state = peerConnection.iceConnectionState
      console.log(`ICE 연결 상태 변경 (${memberId}):`, state)

      // 연결 실패 시 재시도
      if (state === 'failed' || state === 'disconnected') {
         console.log(`연결 실패, 재시도: ${memberId}`)
         // 5초 후 재연결 시도
         setTimeout(() => {
            if (peerConnections[memberId]) {
               peerConnections[memberId].close()
               delete peerConnections[memberId]
               createPeerConnection(roomId, memberId, dispatch, actions)
            }
         }, 5000)
      }
   }

   peerConnection.onconnectionstatechange = () => {
      console.log(`연결 상태 변경 (${memberId}):`, peerConnection.connectionState)
   }

   peerConnection.onsignalingstatechange = () => {
      console.log(`시그널링 상태 변경 (${memberId}):`, peerConnection.signalingState)
   }

   // 스트림 트랙 추가
   if (localStream) {
      console.log(`로컬 스트림 트랙 추가 (${memberId}):`, localStream.getTracks().length)
      localStream.getTracks().forEach((track) => {
         const sender = peerConnection.addTrack(track, localStream)
         console.log(`트랙 추가됨: ${track.kind}, ${track.id}`)
      })
   } else {
      console.warn(`로컬 스트림이 없음 (${memberId})`)
   }

   // ICE Candidate 이벤트 처리
   peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
         console.log(`ICE Candidate 발견 (${memberId}):`, event.candidate.candidate.substring(0, 50) + '...')
         socket.emit('candidate', {
            candidate: event.candidate,
            roomId,
            to: memberId,
            from: socket.id,
         })
      } else {
         console.log(`ICE Candidate 수집 완료 (${memberId})`)
      }
   }

   // 원격 스트림 수신 시 처리
   peerConnection.ontrack = (event) => {
      console.log(`원격 트랙 수신 (${memberId}):`, event.track.kind, event.streams.length)
      if (event.streams && event.streams[0]) {
         console.log(`원격 스트림 수신 (${memberId}):`, event.streams[0].id)
         if (actions.addStreamToState) {
            dispatch(actions.addStreamToState({ userId: memberId, stream: event.streams[0] }))

            // 스트림 수신 알림 표시 - 새로 추가
            const streamNotification = document.createElement('div')
            streamNotification.style.position = 'fixed'
            streamNotification.style.bottom = '10px'
            streamNotification.style.right = '10px'
            streamNotification.style.background = 'rgba(0,128,0,0.8)'
            streamNotification.style.color = 'white'
            streamNotification.style.padding = '10px'
            streamNotification.style.borderRadius = '5px'
            streamNotification.style.zIndex = '10000'
            streamNotification.style.fontSize = '14px'
            streamNotification.textContent = `${memberId}의 스트림을 수신했습니다!`
            document.body.appendChild(streamNotification)

            // 3초 후 알림 제거
            setTimeout(() => {
               streamNotification.remove()
            }, 3000)
         }
      }
   }

   // PeerConnection 저장
   peerConnections[memberId] = peerConnection

   // 오퍼 생성 및 전송
   createAndSendOffer(roomId, memberId, peerConnection)

   return peerConnection
}

const createAndSendOffer = async (roomId, memberId, peerConnection) => {
   try {
      console.log(`오퍼 생성 시작 (${memberId})`)
      const offer = await peerConnection.createOffer({
         offerToReceiveAudio: false,
         offerToReceiveVideo: true,
      })
      console.log(`오퍼 생성 완료 (${memberId}):`, offer.sdp.substring(0, 50) + '...')

      await peerConnection.setLocalDescription(offer)
      console.log(`로컬 설명 설정 완료 (${memberId})`)

      socket.emit('offer', {
         sdp: offer,
         roomId,
         to: memberId,
         from: socket.id,
      })
      console.log(`오퍼 전송 완료 (${memberId})`)
   } catch (error) {
      console.error(`오퍼 생성 실패 (${memberId}):`, error)
   }
}

const setupSocketListeners = (roomId, dispatch, actions) => {
   if (!socket) return

   console.log('소켓 리스너 설정, 액션들:', Object.keys(actions || {}))

   // 기존 리스너 제거
   socket.off('user-joined')
   socket.off('offer')
   socket.off('answer')
   socket.off('candidate')
   socket.off('user-left')

   // 사용자 입장 처리
   socket.on('user-joined', (data) => {
      console.log('사용자 입장 이벤트 수신:', data)
      const newUserId = data.userId
      if (newUserId !== socket.id) {
         // 참가자 추가
         if (actions && actions.addParticipant) {
            console.log('참가자 추가 액션 호출:', newUserId)
            dispatch(actions.addParticipant({ id: newUserId, nickname: '새 참가자' }))
         } else {
            console.warn('addParticipant 액션이 없습니다')
         }

         // 피어 연결 생성
         createPeerConnection(roomId, newUserId, dispatch, actions)
      }
   })

   // 오퍼 처리
   socket.on('offer', async (data) => {
      try {
         console.log(`오퍼 수신: ${data.from} -> ${socket.id}`)
         const { sdp, from, roomId } = data

         // PeerConnection이 없으면 생성
         let peerConnection = peerConnections[from]
         if (!peerConnection) {
            console.log(`새 피어 연결 생성 (오퍼 수신): ${from}`)
            peerConnection = createPeerConnection(roomId, from, dispatch, actions)
         }

         // 이미 원격 설명이 설정되었는지 확인
         const currentState = peerConnection.signalingState
         if (currentState !== 'stable') {
            console.warn(`시그널링 상태가 안정적이지 않음 (${from}):`, currentState)
            return
         }

         console.log(`원격 설명 설정 시작 (${from})`)
         await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
         console.log(`원격 설명 설정 완료 (${from})`)

         console.log(`앤서 생성 시작 (${from})`)
         const answer = await peerConnection.createAnswer()
         console.log(`앤서 생성 완료 (${from}):`, answer.sdp.substring(0, 50) + '...')

         await peerConnection.setLocalDescription(answer)
         console.log(`로컬 설명 설정 완료 (${from})`)

         socket.emit('answer', {
            sdp: answer,
            roomId,
            to: from,
            from: socket.id,
         })
         console.log(`앤서 전송 완료 (${from})`)
      } catch (error) {
         console.error('오퍼 처리 실패:', error)
      }
   })

   // 앤서 처리
   socket.on('answer', async (data) => {
      try {
         console.log(`앤서 수신: ${data.from} -> ${socket.id}`)
         const { sdp, from } = data
         const peerConnection = peerConnections[from]

         if (peerConnection) {
            console.log(`원격 설명 설정 시작 (앤서) (${from})`)
            await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
            console.log(`원격 설명 설정 완료 (앤서) (${from})`)
         } else {
            console.warn(`PeerConnection이 없음 (${from})`)
         }
      } catch (error) {
         console.error('앤서 처리 실패:', error)
      }
   })

   // ICE Candidate 처리
   socket.on('candidate', (data) => {
      try {
         console.log(`ICE Candidate 수신: ${data.from}`)
         const { candidate, from } = data
         const peerConnection = peerConnections[from]

         if (peerConnection) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
            console.log(`ICE Candidate 추가 완료 (${from})`)
         } else {
            console.warn(`PeerConnection이 없음 (${from})`)
         }
      } catch (error) {
         console.error('ICE Candidate 처리 실패:', error)
      }
   })

   // 사용자 퇴장 처리
   socket.on('user-left', (data) => {
      console.log('사용자 퇴장:', data)
      const userId = data.userId

      // 연결 종료
      if (peerConnections[userId]) {
         peerConnections[userId].close()
         delete peerConnections[userId]
         console.log(`${userId}와의 연결 종료`)
      }

      // 스트림 및 참가자 제거
      if (actions.removeStreamFromState) {
         dispatch(actions.removeStreamFromState({ userId }))
      }

      // 참가자 제거
      if (actions.removeParticipant) {
         dispatch(actions.removeParticipant(userId))
      }
   })
}

// 간소화된 연결 테스트 함수 - 새로 추가
export const simplifiedConnection = async (roomId) => {
   if (!socket) initSocketConnection()

   console.log('간소화된 연결 시작, 방 ID:', roomId)

   try {
      // 화면 공유 스트림 생성
      const stream = await navigator.mediaDevices.getDisplayMedia({
         video: { cursor: 'always' },
         audio: false,
      })

      console.log('테스트 화면 공유 스트림 생성 성공:', stream.id)

      // 간단한 비디오 요소 생성 및 표시
      const videoElement = document.createElement('video')
      videoElement.srcObject = stream
      videoElement.autoplay = true
      videoElement.muted = true
      videoElement.style.width = '300px'
      videoElement.style.height = '200px'
      videoElement.style.position = 'fixed'
      videoElement.style.bottom = '10px'
      videoElement.style.right = '10px'
      videoElement.style.zIndex = '9999'
      videoElement.style.border = '2px solid green'

      document.body.appendChild(videoElement)

      // 간단한 메시지 표시
      const message = document.createElement('div')
      message.style.position = 'fixed'
      message.style.bottom = '220px'
      message.style.right = '10px'
      message.style.background = 'rgba(0,0,0,0.7)'
      message.style.color = 'white'
      message.style.padding = '10px'
      message.style.borderRadius = '5px'
      message.style.zIndex = '9999'
      message.textContent = '테스트 화면 공유 중...'

      document.body.appendChild(message)

      // 스트림 종료 이벤트 처리
      stream.getVideoTracks()[0].onended = () => {
         videoElement.remove()
         message.remove()
         stream.getTracks().forEach((track) => track.stop())
      }

      return stream
   } catch (error) {
      console.error('간소화된 연결 실패:', error)
      throw error
   }
}
