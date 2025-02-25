import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import styled from 'styled-components'

const socket = io('http://localhost:3000') // 서버 주소

const Cam = ({ groupmembers }) => {
   const [streams, setStreams] = useState([])
   const videoRefs = useRef([])

   useEffect(() => {
      const startCam = async () => {
         try {
            // 1. 웹캠 스트림 가져오기
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            setStreams((prevStreams) => [...prevStreams, { id: socket.id, stream }])

            // 2. 각 그룹 멤버에 대해 비디오 요소에 스트림 할당
            groupmembers.forEach((member) => {
               const video = videoRefs.current[member.id]
               if (video) {
                  video.srcObject = stream
               }
            })
         } catch (err) {
            console.error('웹캠 접근 실패: ', err)
         }
      }

      startCam()

      // 컴포넌트 언마운트 시 정리
      return () => {
         streams.forEach(({ stream }) => {
            stream.getTracks().forEach((track) => track.stop())
         })
      }
   }, [groupmembers])

   return (
      <Container>
         {groupmembers.map((member) => (
            <ScreenBox key={member.id}>
               <ScreenVideo
                  autoPlay
                  ref={(video) => {
                     videoRefs.current[member.id] = video
                  }}
               />
               <Nickname>{member.User.nickname}</Nickname>
            </ScreenBox>
         ))}
      </Container>
   )
}

export default Cam

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
