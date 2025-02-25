import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import styled from 'styled-components'

const socket = io('http://localhost:3000') // 서버 주소

const ScreenShare = ({ groupmembers }) => {
   const peerConnections = useRef({})

   useEffect(() => {
      const startScreenShare = async () => {
         try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })

            groupmembers.forEach((member) => {
               const peerConnection = new RTCPeerConnection({
                  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
               })

               stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

               peerConnection.onicecandidate = (event) => {
                  if (event.candidate) {
                     socket.emit('candidate', { candidate: event.candidate, roomId: groupmembers.groupId })
                  }
               }

               peerConnection.ontrack = (event) => {
                  // Handle stream from other peers
               }

               peerConnections.current[member.id] = peerConnection
            })

            socket.emit('join_room', groupmembers.groupId)

            socket.on('offer', handleOffer)
            socket.on('answer', handleAnswer)
            socket.on('candidate', handleCandidate)

            const offer = await peerConnections.current[socket.id].createOffer()
            await peerConnections.current[socket.id].setLocalDescription(offer)

            socket.emit('offer', { sdp: peerConnections.current[socket.id].localDescription, roomId: groupmembers.groupId })
         } catch (err) {
            console.error('화면 공유 실패: ', err)
         }
      }

      const handleOffer = async (data) => {
         const peerConnection = peerConnections.current[data.from]
         await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp))
         const answer = await peerConnection.createAnswer()
         await peerConnection.setLocalDescription(answer)
         socket.emit('answer', { sdp: peerConnection.localDescription, roomId: data.groupmembers.groupId })
      }

      const handleAnswer = async (data) => {
         const peerConnection = peerConnections.current[data.from]
         await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp))
      }

      const handleCandidate = (data) => {
         const peerConnection = peerConnections.current[data.from]
         peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
      }

      startScreenShare()

      return () => {
         socket.off('offer', handleOffer)
         socket.off('answer', handleAnswer)
         socket.off('candidate', handleCandidate)
         Object.values(peerConnections.current).forEach((pc) => pc.close())
      }
   }, [groupmembers.groupId, groupmembers])

   return (
      <Container>
         {groupmembers.map((member) => (
            <ScreenBox key={member.id}>
               {member.shareState ? <ScreenVideo autoPlay ref={(video) => video && (video.srcObject = peerConnections.current[member.id]?.remoteStreams[0])} /> : <BlackBackground />}
               <Nickname>{member.User.nickname}</Nickname>
            </ScreenBox>
         ))}
      </Container>
   )
}

export default ScreenShare

// ⭐ Styled Components
const Container = styled.div`
   display: grid;
   grid-template-columns: repeat(2, 1fr);
   grid-template-rows: repeat(3, 1fr);
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
`

const ScreenVideo = styled.video`
   width: 100%;
   max-width: 750px;
   height: auto;
   object-fit: cover;
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

const BlackBackground = styled.div`
   width: 100%;
   height: 100%;
   background-color: #000;
`

// import React, { useEffect, useRef, useState } from 'react'
// import io from 'socket.io-client'
// import styled from 'styled-components'

// const socket = io('http://localhost:3000') // 서버 주소

// // 🔥 Mock 데이터 (더미 데이터, 추후 백엔드 데이터로 대체 가능)
// const mockScreens = [
//    { id: 1, nickname: '사용자1', screenUrl: '/img/camTest.png' },
//    { id: 2, nickname: '사자2', screenUrl: '/img/camTest1.png' },
//    { id: 3, nickname: '사용자3', screenUrl: '/img/camTest2.png' },
//    { id: 4, nickname: '사용자4', screenUrl: '/img/camTest3.png' },
//    { id: 5, nickname: '사용자5', screenUrl: '/img/camTest.png' },
//    { id: 6, nickname: '사용자6dd', screenUrl: '/img/camTest.png' },
// ]

// const ScreenShare = ({ groupmembers }) => {
//    const [streams, setStreams] = useState([])
//    const peerConnections = useRef({})

//    useEffect(() => {
//       const startScreenShare = async () => {
//          try {
//             const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
//             setStreams((prevStreams) => [...prevStreams, { id: socket.id, stream }])

//             groupmembers.forEach((member) => {
//                const peerConnection = new RTCPeerConnection({
//                   iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
//                })

//                stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream))

//                peerConnection.onicecandidate = (event) => {
//                   if (event.candidate) {
//                      socket.emit('candidate', { candidate: event.candidate, roomId: groupmembers.groupId })
//                   }
//                }

//                peerConnection.ontrack = (event) => {
//                   setStreams((prevStreams) => [...prevStreams, { id: member.id, stream: event.streams[0] }])
//                }

//                peerConnections.current[member.id] = peerConnection
//             })

//             socket.emit('join_room', groupmembers.groupId)

//             socket.on('offer', handleOffer)
//             socket.on('answer', handleAnswer)
//             socket.on('candidate', handleCandidate)

//             const offer = await peerConnections.current[socket.id].createOffer()
//             await peerConnections.current[socket.id].setLocalDescription(offer)

//             socket.emit('offer', { sdp: peerConnections.current[socket.id].localDescription, roomId: groupmembers.groupId })
//          } catch (err) {
//             console.error('화면 공유 실패: ', err)
//          }
//       }

//       const handleOffer = async (data) => {
//          const peerConnection = peerConnections.current[data.from]
//          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp))
//          const answer = await peerConnection.createAnswer()
//          await peerConnection.setLocalDescription(answer)
//          socket.emit('answer', { sdp: peerConnection.localDescription, roomId: data.groupmembers.groupId })
//       }

//       const handleAnswer = async (data) => {
//          const peerConnection = peerConnections.current[data.from]
//          await peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp))
//       }

//       const handleCandidate = (data) => {
//          const peerConnection = peerConnections.current[data.from]
//          peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate))
//       }

//       startScreenShare()

//       return () => {
//          socket.off('offer', handleOffer)
//          socket.off('answer', handleAnswer)
//          socket.off('candidate', handleCandidate)
//          Object.values(peerConnections.current).forEach((pc) => pc.close())
//       }
//    }, [groupmembers.groupId, groupmembers])

//    return (
//       <Container>
//          {streams.map(({ id, stream }) => (
//             <ScreenBox key={id}>
//                <Screenvideo autoPlay ref={(video) => video && (video.srcObject = stream)} />
//                <Nickname>{groupmembers.find((member) => member.id === id)?.nickname || '사용자'}</Nickname>
//             </ScreenBox>
//          ))}
//       </Container>
//    )
// }

// export default ScreenShare

// // ⭐ Styled Components
// const Container = styled.div`
//    display: grid;
//    grid-template-columns: repeat(2, 1fr); /* ✅ 2열 */
//    grid-template-rows: repeat(3, 1fr); /* ✅ 3행 */
//    gap: 16px;
//    width: 100%;
//    height: 150vh;
//    padding: 20px;
// `

// const ScreenBox = styled.div`
//    position: relative;
//    display: flex;
//    justify-content: center;
//    align-items: center;
//    border: 2px solid #ddd;
//    border-radius: 8px;
//    overflow: hidden;
//    background-color: #000;
// `

// const Screenvideo = styled.video`
//    width: 100%;
//    max-width: 750px;
//    height: auto;
//    object-fit: cover;
// `

// const Nickname = styled.div`
//    position: absolute;
//    bottom: 10px;
//    right: 10px;
//    background: rgba(0, 0, 0, 0.6);
//    color: #fff;
//    padding: 10px 15px;
//    border-radius: 5px;
//    font-size: 14px;
// `
