import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import styled from 'styled-components'

const socket = io('http://localhost:3000') // 서버 주소

const ScreenShare = ({ groupmembers }) => {
   const [streams, setStreams] = useState({}) // 멤버별 스트림을 관리하는 객체
   const peerConnections = useRef({})
   const localStreamRef = useRef(null)

   useEffect(() => {
      // 소켓 이벤트 리스너 등록
      socket.on('offer', handleOffer)
      socket.on('answer', handleAnswer)
      socket.on('candidate', handleCandidate)
      socket.on('user-joined', handleUserJoined)

      // 방에 입장
      socket.emit('join_room', { roomId: groupmembers.groupId })

      // 화면 공유 시작
      startScreenShare()

      // 컴포넌트 언마운트 시 이벤트 리스너 제거 및 PeerConnection 종료
      return () => {
         socket.off('offer', handleOffer)
         socket.off('answer', handleAnswer)
         socket.off('candidate', handleCandidate)
         socket.off('user-joined', handleUserJoined)

         // 로컬 스트림 트랙 종료
         if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop())
         }

         // PeerConnection 종료
         Object.values(peerConnections.current).forEach((pc) => pc.close())
      }
   }, [])

   const startScreenShare = async () => {
      try {
         // 화면 공유 스트림 생성
         const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: 'always' },
            audio: false,
         })
         console.log('화면 공유 스트림:', stream)

         // 로컬 스트림 저장
         localStreamRef.current = stream

         // 자신의 스트림 추가 - 소켓 ID 대신 'local' 사용
         setStreams((prevStreams) => ({
            ...prevStreams,
            local: stream,
         }))

         // 화면 공유 시작 알림
         socket.emit('screen_share_started', { roomId: groupmembers.groupId })

         // 다른 사용자들과 연결
         createPeerConnections()
      } catch (err) {
         console.error('화면 공유 실패: ', err)
      }
   }

   const createPeerConnections = () => {
      // 각 멤버에 대해 RTCPeerConnection 생성
      groupmembers.forEach((member) => {
         if (member.id === socket.id) return // 자신은 제외

         const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }],
         })

         // 연결 상태 변화 이벤트 처리
         peerConnection.oniceconnectionstatechange = () => {
            console.log(`ICE 연결 상태 (${member.id}):`, peerConnection.iceConnectionState)
         }

         peerConnection.onconnectionstatechange = () => {
            console.log(`연결 상태 (${member.id}):`, peerConnection.connectionState)
         }

         // 스트림 트랙 추가
         if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
               peerConnection.addTrack(track, localStreamRef.current)
               console.log('트랙 추가:', track)
            })
         }

         // ICE Candidate 이벤트 처리
         peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
               console.log('ICE Candidate 전송:', event.candidate)
               socket.emit('candidate', {
                  candidate: event.candidate,
                  roomId: groupmembers.groupId,
                  to: member.id,
                  from: socket.id,
               })
            }
         }

         // 원격 스트림 수신 시 처리
         peerConnection.ontrack = (event) => {
            console.log('원격 스트림 수신:', event.streams[0])
            setStreams((prevStreams) => ({
               ...prevStreams,
               [member.id]: event.streams[0],
            }))
         }

         // PeerConnection 저장
         peerConnections.current[member.id] = peerConnection

         // 오퍼 생성 및 전송
         createAndSendOffer(member.id, peerConnection)
      })
   }

   const createAndSendOffer = async (memberId, peerConnection) => {
      try {
         const offer = await peerConnection.createOffer()
         await peerConnection.setLocalDescription(offer)
         console.log('오퍼 생성:', offer)

         socket.emit('offer', {
            sdp: offer,
            roomId: groupmembers.groupId,
            to: memberId,
            from: socket.id,
         })
      } catch (error) {
         console.error('오퍼 생성 실패:', error)
      }
   }

   // 사용자 입장 처리
   const handleUserJoined = (data) => {
      console.log('사용자 입장:', data)
      // 새로운 사용자와 연결
      const newUserId = data.userId

      if (newUserId !== socket.id && !peerConnections.current[newUserId]) {
         const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }],
         })

         // 연결 상태 변화 이벤트 처리
         peerConnection.oniceconnectionstatechange = () => {
            console.log(`ICE 연결 상태 (${newUserId}):`, peerConnection.iceConnectionState)
         }

         // 스트림 트랙 추가
         if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
               peerConnection.addTrack(track, localStreamRef.current)
            })
         }

         // ICE Candidate 이벤트 처리
         peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
               socket.emit('candidate', {
                  candidate: event.candidate,
                  roomId: groupmembers.groupId,
                  to: newUserId,
                  from: socket.id,
               })
            }
         }

         // 원격 스트림 수신 시 처리
         peerConnection.ontrack = (event) => {
            console.log('원격 스트림 수신:', event.streams[0])
            setStreams((prevStreams) => ({
               ...prevStreams,
               [newUserId]: event.streams[0],
            }))
         }

         // PeerConnection 저장
         peerConnections.current[newUserId] = peerConnection

         // 오퍼 생성 및 전송
         createAndSendOffer(newUserId, peerConnection)
      }
   }

   // 오퍼 처리
   const handleOffer = async (data) => {
      console.log('오퍼 수신:', data)
      try {
         const { sdp, from } = data

         // PeerConnection이 없으면 생성
         if (!peerConnections.current[from]) {
            const peerConnection = new RTCPeerConnection({
               iceServers: [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }],
            })

            // 연결 상태 변화 이벤트 처리
            peerConnection.oniceconnectionstatechange = () => {
               console.log(`ICE 연결 상태 (${from}):`, peerConnection.iceConnectionState)
            }

            // 스트림 트랙 추가
            if (localStreamRef.current) {
               localStreamRef.current.getTracks().forEach((track) => {
                  peerConnection.addTrack(track, localStreamRef.current)
               })
            }

            // ICE Candidate 이벤트 처리
            peerConnection.onicecandidate = (event) => {
               if (event.candidate) {
                  socket.emit('candidate', {
                     candidate: event.candidate,
                     roomId: groupmembers.groupId,
                     to: from,
                     from: socket.id,
                  })
               }
            }

            // 원격 스트림 수신 시 처리
            peerConnection.ontrack = (event) => {
               console.log('원격 스트림 수신:', event.streams[0])
               setStreams((prevStreams) => ({
                  ...prevStreams,
                  [from]: event.streams[0],
               }))
            }

            // PeerConnection 저장
            peerConnections.current[from] = peerConnection
         }

         const peerConnection = peerConnections.current[from]
         await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))

         const answer = await peerConnection.createAnswer()
         await peerConnection.setLocalDescription(answer)
         console.log('앤서 생성:', answer)

         socket.emit('answer', {
            sdp: answer,
            roomId: groupmembers.groupId,
            to: from,
            from: socket.id,
         })
      } catch (error) {
         console.error('오퍼 처리 실패:', error)
      }
   }

   // 앤서 처리
   const handleAnswer = async (data) => {
      console.log('앤서 수신:', data)
      try {
         const { sdp, from } = data
         const peerConnection = peerConnections.current[from]

         if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
            console.log('원격 설명 설정 완료')
         }
      } catch (error) {
         console.error('앤서 처리 실패:', error)
      }
   }

   // ICE Candidate 처리
   const handleCandidate = (data) => {
      console.log('ICE Candidate 수신:', data)
      try {
         const { candidate, from } = data
         const peerConnection = peerConnections.current[from]

         if (peerConnection) {
            peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
            console.log('ICE Candidate 추가 완료')
         }
      } catch (error) {
         console.error('ICE Candidate 처리 실패:', error)
      }
   }

   return (
      <Container>
         {/* 자신의 화면 공유 */}
         <ScreenBox key="local">
            {streams.local ? <Screenvideo autoPlay muted ref={(video) => video && (video.srcObject = streams.local)} /> : <BlackScreen />}
            <Nickname>내 화면</Nickname>
         </ScreenBox>

         {/* 다른 멤버들의 화면 */}
         {groupmembers
            .filter((member) => member.id !== socket.id)
            .map((member) => (
               <ScreenBox key={member.id}>
                  {streams[member.id] ? <Screenvideo autoPlay ref={(video) => video && (video.srcObject = streams[member.id])} /> : <BlackScreen />}
                  <Nickname>{member.nickname || '사용자'}</Nickname>
               </ScreenBox>
            ))}
      </Container>
   )
}

export default ScreenShare

// ⭐ Styled Components
const Container = styled.div`
   display: grid;
   grid-template-columns: repeat(2, 1fr); /* ✅ 2열 */
   grid-template-rows: repeat(3, 1fr); /* ✅ 3행 */
   gap: 16px;
   width: 100%;
   height: 150vh;
   padding: 20px;
`

const ScreenBox = styled.div`
   position: relative;
   display: flex;
   justify-content: center;
   align-items: center;
   border: 2px solid #ddd;
   border-radius: 8px;
   overflow: hidden;
   background-color: #000;
   min-height: 200px;
`

const Screenvideo = styled.video`
   width: 100%;
   max-width: 750px;
   height: auto;
   object-fit: cover;
`

const BlackScreen = styled.div`
   width: 100%;
   height: 100%;
   background-color: #000;
`

const Nickname = styled.div`
   position: absolute;
   bottom: 10px;
   right: 10px;
   background: rgba(0, 0, 0, 0.6);
   color: #fff;
   padding: 10px 15px;
   border-radius: 5px;
   font-size: 14px;
`
