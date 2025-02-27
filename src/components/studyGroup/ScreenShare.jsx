import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { startScreenShareThunk, stopScreenShareThunk, cleanupConnectionThunk, updateScreenShareStatusThunk, setInitialParticipants } from '../../features/screenShareSlice'
import { debugSocketInfo, testSignaling, simplifiedConnection } from '../../api/screenShareApi'

const ScreenShare = ({ groupmembers, studygroup }) => {
   const dispatch = useDispatch()
   const { streams, isSharing, participants, loading, error } = useSelector((state) => state.screenShare) || {
      streams: {},
      participants: [],
      isSharing: false,
      loading: false,
      error: null,
   }

   // 비디오 요소 참조 저장
   const videoRefs = useRef({})
   const [videoElements, setVideoElements] = useState({})

   // 사용자 인증 정보에서 현재 사용자 ID 가져오기
   const authState = useSelector((state) => state.auth) || {}
   const [currentUserId] = useState(() => authState.user?.id || window.socketId || 'local')

   // 소켓 ID 추적
   const [socketId, setSocketId] = useState(window.socketId || 'unknown')

   // 그룹 ID 설정
   const groupId = studygroup?.id

   // 소켓 ID 업데이트 함수
   useEffect(() => {
      // 소켓 ID가 변경되면 업데이트
      const checkSocketId = setInterval(() => {
         if (window.socketId && window.socketId !== socketId) {
            console.log('소켓 ID 업데이트:', window.socketId)
            setSocketId(window.socketId)
         }
      }, 1000)

      return () => clearInterval(checkSocketId)
   }, [socketId])

   // 컴포넌트 마운트 시 소켓 ID 표시
   useEffect(() => {
      // 소켓 ID 표시 (디버깅용)
      const socketIdDisplay = document.createElement('div')
      socketIdDisplay.style.position = 'fixed'
      socketIdDisplay.style.top = '10px'
      socketIdDisplay.style.left = '10px'
      socketIdDisplay.style.background = 'rgba(0,0,0,0.7)'
      socketIdDisplay.style.color = 'white'
      socketIdDisplay.style.padding = '5px'
      socketIdDisplay.style.zIndex = '9999'
      socketIdDisplay.style.fontSize = '12px'
      socketIdDisplay.textContent = `Socket ID: ${socketId}, User ID: ${currentUserId}`
      document.body.appendChild(socketIdDisplay)

      // 방 ID 표시 (디버깅용)
      const roomIdDisplay = document.createElement('div')
      roomIdDisplay.style.position = 'fixed'
      roomIdDisplay.style.top = '30px'
      roomIdDisplay.style.left = '10px'
      roomIdDisplay.style.background = 'rgba(0,0,0,0.7)'
      roomIdDisplay.style.color = 'white'
      roomIdDisplay.style.padding = '5px'
      roomIdDisplay.style.zIndex = '9999'
      roomIdDisplay.style.fontSize = '12px'
      roomIdDisplay.textContent = `Room ID: ${groupId || 'unknown'}`
      document.body.appendChild(roomIdDisplay)

      return () => {
         // 컴포넌트 언마운트 시 제거
         socketIdDisplay.remove()
         roomIdDisplay.remove()
      }
   }, [currentUserId, groupId, socketId])

   useEffect(() => {
      // 참가자 정보 초기화 (그룹멤버 데이터 구조에 맞게 변환)
      if (groupmembers && groupmembers.length > 0) {
         const formattedParticipants = groupmembers.map((member) => ({
            id: member.userId,
            nickname: member.User ? member.User.nickname : `사용자 ${member.userId}`,
            role: member.role,
            status: member.status,
            shareState: member.shareState,
            camState: member.camState,
            voiceState: member.voiceState,
         }))

         dispatch(setInitialParticipants(formattedParticipants))
      }
   }, [dispatch, groupmembers])

   // 스트림 변경 시 비디오 요소 직접 업데이트 (ref 사용 대신)
   useEffect(() => {
      // 새로운 비디오 요소 객체 생성
      const newVideoElements = {}

      // 스트림 정보 로깅
      console.log('스트림 업데이트됨:', Object.keys(streams))

      Object.entries(streams).forEach(([streamId, stream]) => {
         // 이미 비디오 요소가 있으면 재사용
         if (videoElements[streamId] && videoElements[streamId].srcObject !== stream) {
            console.log(`기존 비디오 요소 업데이트: ${streamId}`)
            videoElements[streamId].srcObject = stream
            newVideoElements[streamId] = videoElements[streamId]
         } else {
            // 새 비디오 요소 생성
            console.log(`새 비디오 요소 생성: ${streamId}`)
            const video = document.createElement('video')
            video.autoplay = true
            video.playsInline = true
            video.muted = streamId === socketId || streamId === currentUserId || streamId === 'local'
            video.srcObject = stream
            video.id = `video-${streamId}`
            video.style.width = '100%'
            video.style.height = '100%'
            video.style.objectFit = 'cover'

            // 비디오 요소 저장
            newVideoElements[streamId] = video

            // 성공 알림 표시
            const notification = document.createElement('div')
            notification.style.position = 'fixed'
            notification.style.bottom = '10px'
            notification.style.right = '10px'
            notification.style.background = 'rgba(0,128,0,0.8)'
            notification.style.color = 'white'
            notification.style.padding = '10px'
            notification.style.borderRadius = '5px'
            notification.style.zIndex = '10000'
            notification.style.fontSize = '14px'
            notification.textContent = `스트림 할당 성공: ${streamId}`
            document.body.appendChild(notification)

            // 3초 후 알림 제거
            setTimeout(() => notification.remove(), 3000)
         }
      })

      setVideoElements(newVideoElements)
   }, [streams, currentUserId, socketId, videoElements])

   // 화면 공유 시작 함수
   const handleStartScreenShare = async () => {
      if (!groupId) {
         console.error('그룹 ID가 없습니다.')
         return
      }

      try {
         // 직접 화면 공유 스트림 가져오기
         const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: 'always' },
            audio: false,
         })

         // 스트림 정보 출력
         console.log('화면 공유 스트림 생성 성공:', stream.id)

         // 스트림 중지 이벤트 처리
         stream.getVideoTracks()[0].onended = () => {
            handleStopScreenShare()
         }

         // 테스트용 비디오 요소 표시
         const testVideo = document.createElement('video')
         testVideo.srcObject = stream
         testVideo.autoplay = true
         testVideo.muted = true
         testVideo.style.width = '200px'
         testVideo.style.height = '150px'
         testVideo.style.position = 'fixed'
         testVideo.style.bottom = '10px'
         testVideo.style.left = '10px'
         testVideo.style.zIndex = '10000'
         testVideo.style.border = '2px solid green'
         document.body.appendChild(testVideo)

         // 5초 후 테스트 비디오 제거
         setTimeout(() => testVideo.remove(), 5000)

         // Redux 액션 디스패치
         dispatch(
            startScreenShareThunk({
               roomId: groupId,
               groupMembers: groupmembers.map((member) => ({
                  id: member.userId,
                  nickname: member.User ? member.User.nickname : `사용자 ${member.userId}`,
               })),
               stream, // 스트림 직접 전달
            })
         )

         // 화면 공유 상태 업데이트 (DB)
         dispatch(
            updateScreenShareStatusThunk({
               groupId: groupId,
               userId: currentUserId,
               shareState: true,
            })
         )
      } catch (error) {
         console.error('화면 공유 시작 실패:', error)
      }
   }

   // 화면 공유 중지 함수
   const handleStopScreenShare = () => {
      if (!groupId) return

      dispatch(stopScreenShareThunk())

      // 화면 공유 상태 업데이트 (DB)
      dispatch(
         updateScreenShareStatusThunk({
            groupId: groupId,
            userId: currentUserId,
            shareState: false,
         })
      )
   }

   // 컴포넌트 언마운트 시 정리
   useEffect(() => {
      return () => {
         dispatch(cleanupConnectionThunk())

         if (groupId) {
            dispatch(
               updateScreenShareStatusThunk({
                  groupId: groupId,
                  userId: currentUserId,
                  shareState: false,
               })
            )
         }
      }
   }, [dispatch, groupId, currentUserId])

   // 디버그 정보 표시 함수
   const handleDebugInfo = () => {
      debugSocketInfo()
      console.log('현재 스트림 상태:', streams)
      console.log('현재 참가자 상태:', participants)
      console.log('현재 비디오 요소:', videoElements)
   }

   // 시그널링 테스트 함수
   const handleTestSignaling = () => {
      testSignaling(groupId)
   }

   // 간소화된 연결 테스트 함수
   const handleSimplifiedConnection = () => {
      simplifiedConnection(groupId)
   }

   // 기본 화면 공유 테스트 함수
   const testBasicScreenShare = async () => {
      try {
         const stream = await navigator.mediaDevices.getDisplayMedia({
            video: { cursor: 'always' },
            audio: false,
         })

         console.log('테스트 화면 공유 스트림 생성 성공:', stream.id)

         // 테스트 비디오 요소 생성
         const video = document.createElement('video')
         video.srcObject = stream
         video.autoplay = true
         video.muted = true
         video.style.width = '300px'
         video.style.height = '200px'
         video.style.position = 'fixed'
         video.style.bottom = '50px'
         video.style.right = '10px'
         video.style.zIndex = '10000'
         video.style.border = '3px solid red'

         document.body.appendChild(video)

         // 스트림 종료 이벤트 처리
         stream.getVideoTracks()[0].onended = () => {
            video.remove()
         }
      } catch (error) {
         console.error('테스트 스트림 생성 실패:', error)
      }
   }

   // 로딩 표시
   if (loading) {
      return <LoadingContainer>화면 공유 연결 중...</LoadingContainer>
   }

   // 에러 표시
   if (error) {
      return (
         <ErrorContainer>
            <p>오류: {error}</p>
            <RetryButton onClick={handleStartScreenShare}>다시 시도</RetryButton>
         </ErrorContainer>
      )
   }

   return (
      <Container>
         {/* 디버그 버튼 */}
         <DebugButtons>
            <DebugButton onClick={handleDebugInfo}>디버그 정보</DebugButton>
            <DebugButton onClick={handleTestSignaling}>시그널링 테스트</DebugButton>
            <DebugButton onClick={handleSimplifiedConnection}>간소화된 연결</DebugButton>
            <DebugButton onClick={testBasicScreenShare}>기본 화면공유 테스트</DebugButton>
         </DebugButtons>

         {/* 모든 멤버의 화면을 groupmembers 순서대로 표시 */}
         {groupmembers.map((member) => {
            const isCurrentUser = member.userId === currentUserId
            const nickname = member.User?.nickname || `사용자 ${member.userId}`

            // 가능한 스트림 ID 목록
            const possibleStreamIds = isCurrentUser ? [currentUserId, 'local', socketId] : [member.userId, `user-${member.userId}`]

            // 스트림 찾기
            const streamId = possibleStreamIds.find((id) => streams[id])
            const hasStream = Boolean(streamId)

            return (
               <ScreenBox key={member.userId} isCurrentUser={isCurrentUser}>
                  {hasStream ? (
                     <VideoContainer
                        id={`video-container-${member.userId}`}
                        ref={(el) => {
                           if (el && streamId && videoElements[streamId]) {
                              // 기존 자식 노드 삭제
                              while (el.firstChild) {
                                 el.removeChild(el.firstChild)
                              }
                              // 비디오 요소 추가
                              if (el.childNodes.length === 0) {
                                 el.appendChild(videoElements[streamId])
                              }
                           }
                        }}
                     />
                  ) : (
                     <BlackScreen>{isCurrentUser && !isSharing && <StartButton onClick={handleStartScreenShare}>화면 공유 시작</StartButton>}</BlackScreen>
                  )}
                  <Nickname>{nickname}</Nickname>

                  {/* 현재 사용자이고 화면 공유 중일 때만 중지 버튼 표시 */}
                  {isCurrentUser && isSharing && <StopButton onClick={handleStopScreenShare}>화면 공유 중지</StopButton>}
               </ScreenBox>
            )
         })}
      </Container>
   )
}

export default ScreenShare

// Styled Components
const Container = styled.div`
   display: grid;
   grid-template-columns: repeat(2, 1fr);
   grid-auto-rows: minmax(200px, 1fr);
   gap: 16px;
   width: 100%;
   padding: 20px;
   min-height: 400px;
   max-height: 80vh;
   overflow-y: auto;
`

const ScreenBox = styled.div`
   position: relative;
   display: flex;
   justify-content: center;
   align-items: center;
   border: 2px solid ${(props) => (props.isCurrentUser ? '#4CAF50' : '#ddd')};
   border-radius: 8px;
   overflow: hidden;
   background-color: #000;
   min-height: 200px;
   aspect-ratio: 16 / 9;
`

const VideoContainer = styled.div`
   width: 100%;
   height: 100%;
   overflow: hidden;
`

const BlackScreen = styled.div`
   width: 100%;
   height: 100%;
   background-color: #1a1a1a;
   display: flex;
   justify-content: center;
   align-items: center;
`

const Nickname = styled.div`
   position: absolute;
   bottom: 10px;
   left: 10px;
   background: rgba(0, 0, 0, 0.6);
   color: #fff;
   padding: 8px 12px;
   border-radius: 4px;
   font-size: 14px;
`

const StartButton = styled.button`
   background: #4caf50;
   color: white;
   border: none;
   border-radius: 4px;
   padding: 10px 15px;
   font-size: 14px;
   cursor: pointer;
   transition: background 0.3s;

   &:hover {
      background: #45a049;
   }
`

const StopButton = styled.button`
   position: absolute;
   top: 10px;
   right: 10px;
   background: rgba(255, 0, 0, 0.8);
   color: white;
   border: none;
   border-radius: 4px;
   padding: 8px 12px;
   font-size: 12px;
   cursor: pointer;
   transition: background 0.3s;

   &:hover {
      background: rgba(255, 0, 0, 1);
   }
`

const RetryButton = styled(StartButton)`
   margin-top: 15px;
`

const DebugButtons = styled.div`
   position: fixed;
   bottom: 10px;
   right: 10px;
   display: flex;
   flex-direction: column;
   gap: 5px;
   z-index: 9999;
`

const DebugButton = styled.button`
   background: rgba(0, 123, 255, 0.8);
   color: white;
   border: none;
   border-radius: 4px;
   padding: 8px 12px;
   font-size: 12px;
   cursor: pointer;
   transition: background 0.3s;

   &:hover {
      background: rgba(0, 123, 255, 1);
   }
`

const LoadingContainer = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 300px;
   font-size: 16px;
   color: #666;
`

const ErrorContainer = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   height: 300px;
   font-size: 16px;
   color: #d32f2f;
   text-align: center;
   padding: 20px;
`
