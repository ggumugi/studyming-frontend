import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import Peer from 'peerjs'
import { updateScreenShareStatusThunk, fetchActivePeersThunk, setIsSharing } from '../../features/screenShareSlice'
import { logPeerConnectionStatus } from '../../api/screenShareApi'

const ScreenShare = ({ groupmembers, studygroup }) => {
   const dispatch = useDispatch()

   // 상태 관리
   const [myStream, setMyStream] = useState(null)
   const [peers, setPeers] = useState({})
   const [remoteStreams, setRemoteStreams] = useState({})
   const [connecting, setConnecting] = useState(false)
   const [errorMessage, setErrorMessage] = useState(null)

   // Redux 상태
   const screenShareState = useSelector((state) => state.screenShare || {})
   const { isSharing, activePeers } = screenShareState

   // 참조 객체
   const peerRef = useRef(null)
   const connectionRef = useRef({})
   const videoRefs = useRef({})

   // 사용자 정보
   const authState = useSelector((state) => state.auth || {})
   const currentUser = authState.user || {}

   // 그룹 ID
   const groupId = studygroup?.id

   // 활성 피어 목록 조회
   useEffect(() => {
      if (groupId) {
         dispatch(fetchActivePeersThunk(groupId))
      }
   }, [dispatch, groupId])

   // PeerJS 초기화 및 연결 설정
   useEffect(() => {
      if (!groupId || !currentUser.id) return

      // 기존 연결 정리
      if (peerRef.current) {
         peerRef.current.destroy()
      }

      // 고유 피어 ID 생성 (사용자 ID + 그룹 ID 조합)
      const peerId = `user-${currentUser.id}-group-${groupId}`

      // PeerJS 인스턴스 생성
      const peer = new Peer(peerId, {
         host: process.env.REACT_APP_PEERJS_HOST || 'localhost',
         port: process.env.REACT_APP_PEERJS_PORT || 8002,
         path: process.env.REACT_APP_PEERJS_PATH || '/peerjs',
         debug: 2,
      })

      peerRef.current = peer

      // 연결 성공 이벤트
      peer.on('open', (id) => {
         console.log('PeerJS 연결 성공:', id)
         logPeerConnectionStatus(id, 'connected')

         // 그룹의 다른 멤버들에게 자신의 존재 알림
         notifyPresence()
      })

      // 연결 오류 이벤트
      peer.on('error', (err) => {
         console.error('PeerJS 오류:', err)
         logPeerConnectionStatus(peerId, 'error', { error: err })
         setErrorMessage(`연결 오류: ${err.type}`)
      })

      // 다른 피어로부터 연결 요청 수신
      peer.on('connection', (conn) => {
         handleConnection(conn)
      })

      // 통화 수신 이벤트
      peer.on('call', (call) => {
         console.log('화면 공유 호출 수신:', call.peer)
         logPeerConnectionStatus(call.peer, 'incoming call')

         // 호출 응답 (자신의 스트림이 있으면 전송, 없으면 빈 스트림)
         const emptyStream = new MediaStream()
         call.answer(myStream || emptyStream)

         // 스트림 수신 처리
         call.on('stream', (remoteStream) => {
            console.log('원격 스트림 수신:', call.peer)
            logPeerConnectionStatus(call.peer, 'received stream')

            // 원격 스트림 저장
            setRemoteStreams((prev) => ({
               ...prev,
               [call.peer]: remoteStream,
            }))
         })

         // 호출 종료 처리
         call.on('close', () => {
            console.log('호출 종료:', call.peer)
            logPeerConnectionStatus(call.peer, 'call closed')
            setRemoteStreams((prev) => {
               const newStreams = { ...prev }
               delete newStreams[call.peer]
               return newStreams
            })
         })

         // 호출 객체 저장
         setPeers((prev) => ({
            ...prev,
            [call.peer]: call,
         }))
      })

      // 컴포넌트 언마운트 시 정리
      return () => {
         // 모든 연결 종료
         Object.values(connectionRef.current).forEach((conn) => {
            if (conn) conn.close()
         })

         // 모든 피어 연결 종료
         Object.values(peers).forEach((call) => {
            if (call) call.close()
         })

         // 스트림 정리
         if (myStream) {
            myStream.getTracks().forEach((track) => track.stop())
         }

         // PeerJS 인스턴스 정리
         if (peerRef.current) {
            peerRef.current.destroy()
         }

         // 화면 공유 상태 업데이트 (DB)
         if (currentUser.id && groupId && isSharing) {
            dispatch(
               updateScreenShareStatusThunk({
                  groupId,
                  userId: currentUser.id,
                  shareState: false,
               })
            )
         }
      }
   }, [groupId, currentUser.id, dispatch, isSharing])

   // 다른 멤버들에게 자신의 존재 알림
   const notifyPresence = () => {
      if (groupmembers && peerRef.current) {
         groupmembers.forEach((member) => {
            // 자신이 아닌 멤버에게만 연결
            if (member.userId !== currentUser.id) {
               const remotePeerId = `user-${member.userId}-group-${groupId}`
               connectToPeer(remotePeerId)
            }
         })
      }
   }

   // 피어 연결 처리
   const handleConnection = (conn) => {
      console.log('새 데이터 연결 수신:', conn.peer)
      logPeerConnectionStatus(conn.peer, 'new connection')

      // 연결 이벤트 처리
      conn.on('open', () => {
         console.log('데이터 연결 열림:', conn.peer)
         logPeerConnectionStatus(conn.peer, 'connection open')

         // 연결 객체 저장
         connectionRef.current[conn.peer] = conn

         // 데이터 수신 처리
         conn.on('data', (data) => {
            console.log('데이터 수신:', data)
            logPeerConnectionStatus(conn.peer, 'data received', data)

            // 화면 공유 시작/중지 메시지 처리
            if (data.type === 'screen-share-status') {
               // 원격 피어의 화면 공유 상태 업데이트
               // (필요시 구현)
            }
         })

         // 연결 종료 처리
         conn.on('close', () => {
            console.log('데이터 연결 종료:', conn.peer)
            logPeerConnectionStatus(conn.peer, 'connection closed')
            delete connectionRef.current[conn.peer]
         })
      })
   }

   // 피어 연결 시도
   const connectToPeer = (remotePeerId) => {
      if (!peerRef.current) return

      // 이미 연결된 경우 무시
      if (connectionRef.current[remotePeerId]) return

      console.log('피어 연결 시도:', remotePeerId)
      logPeerConnectionStatus(remotePeerId, 'connecting')

      // 데이터 연결 생성
      const conn = peerRef.current.connect(remotePeerId)

      // 연결 성공 시 처리
      conn.on('open', () => {
         console.log('데이터 연결 성공:', remotePeerId)
         logPeerConnectionStatus(remotePeerId, 'connected')

         // 연결 객체 저장
         connectionRef.current[remotePeerId] = conn

         // 현재 화면 공유 상태 전송
         conn.send({
            type: 'screen-share-status',
            isSharing: isSharing,
         })

         // 데이터 수신 처리
         conn.on('data', (data) => {
            console.log('데이터 수신:', data)
            logPeerConnectionStatus(remotePeerId, 'data received', data)

            // 화면 공유 상태 메시지 처리
            if (data.type === 'screen-share-status') {
               // 원격 피어의 화면 공유 상태 업데이트
               // (필요시 구현)
            }
         })

         // 연결 종료 처리
         conn.on('close', () => {
            console.log('데이터 연결 종료:', remotePeerId)
            logPeerConnectionStatus(remotePeerId, 'connection closed')
            delete connectionRef.current[remotePeerId]
         })
      })

      // 연결 오류 처리
      conn.on('error', (err) => {
         console.error('데이터 연결 오류:', err)
         logPeerConnectionStatus(remotePeerId, 'connection error', { error: err })
      })
   }

   // 화면 공유 시작
   const startScreenShare = async () => {
      try {
         setConnecting(true)
         setErrorMessage(null)

         // 화면 공유 스트림 가져오기
         const stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
               cursor: 'always',
               width: { ideal: 1280 },
               height: { ideal: 720 },
               frameRate: { max: 15 },
            },
            audio: false,
         })

         // 화면 공유 중지 이벤트 처리
         stream.getVideoTracks()[0].onended = () => {
            stopScreenShare()
         }

         setMyStream(stream)

         // Redux 상태 업데이트
         dispatch(setIsSharing(true))

         // 자신의 비디오 요소에 스트림 설정
         if (videoRefs.current.local) {
            videoRefs.current.local.srcObject = stream
         }

         // 화면 공유 상태 업데이트 (DB)
         if (currentUser.id) {
            dispatch(
               updateScreenShareStatusThunk({
                  groupId,
                  userId: currentUser.id,
                  shareState: true,
               })
            )
         }

         // 모든 연결된 피어에게 화면 공유 상태 알림
         Object.values(connectionRef.current).forEach((conn) => {
            if (conn && conn.open) {
               conn.send({
                  type: 'screen-share-status',
                  isSharing: true,
               })
            }
         })

         // 모든 그룹 멤버에게 미디어 호출
         if (groupmembers && peerRef.current) {
            groupmembers.forEach((member) => {
               // 자신이 아닌 멤버에게만 호출
               if (member.userId !== currentUser.id) {
                  const remotePeerId = `user-${member.userId}-group-${groupId}`

                  // 미디어 호출 생성
                  const call = peerRef.current.call(remotePeerId, stream)

                  // 호출 이벤트 처리
                  if (call) {
                     // 스트림 수신 처리
                     call.on('stream', (remoteStream) => {
                        console.log('원격 스트림 수신 (호출 후):', remotePeerId)

                        // 원격 스트림 저장
                        setRemoteStreams((prev) => ({
                           ...prev,
                           [remotePeerId]: remoteStream,
                        }))
                     })

                     // 호출 종료 처리
                     call.on('close', () => {
                        console.log('호출 종료:', remotePeerId)
                        setRemoteStreams((prev) => {
                           const newStreams = { ...prev }
                           delete newStreams[remotePeerId]
                           return newStreams
                        })
                     })

                     // 호출 객체 저장
                     setPeers((prev) => ({
                        ...prev,
                        [remotePeerId]: call,
                     }))
                  }
               }
            })
         }

         setConnecting(false)
      } catch (err) {
         console.error('화면 공유 시작 오류:', err)
         setErrorMessage(err.message || '화면 공유를 시작할 수 없습니다.')
         dispatch(setIsSharing(false))
         setConnecting(false)
      }
   }

   // 화면 공유 중지
   const stopScreenShare = () => {
      // 스트림 정리
      if (myStream) {
         myStream.getTracks().forEach((track) => track.stop())
         setMyStream(null)
      }

      // Redux 상태 업데이트
      dispatch(setIsSharing(false))

      // 화면 공유 상태 업데이트 (DB)
      if (currentUser.id && groupId) {
         dispatch(
            updateScreenShareStatusThunk({
               groupId,
               userId: currentUser.id,
               shareState: false,
            })
         )
      }

      // 모든 연결된 피어에게 화면 공유 중지 알림
      Object.values(connectionRef.current).forEach((conn) => {
         if (conn && conn.open) {
            conn.send({
               type: 'screen-share-status',
               isSharing: false,
            })
         }
      })

      // 모든 피어 연결 종료
      Object.values(peers).forEach((call) => {
         if (call) call.close()
      })

      setPeers({})
   }

   // 비디오 요소 업데이트
   useEffect(() => {
      // 내 스트림 설정
      if (myStream && videoRefs.current.local) {
         videoRefs.current.local.srcObject = myStream
      }

      // 원격 스트림 설정
      Object.entries(remoteStreams).forEach(([peerId, stream]) => {
         if (videoRefs.current[peerId] && videoRefs.current[peerId].srcObject !== stream) {
            videoRefs.current[peerId].srcObject = stream
         }
      })
   }, [myStream, remoteStreams])

   // 로딩 표시
   if (connecting) {
      return <LoadingContainer>화면 공유 연결 중...</LoadingContainer>
   }

   // 오류 표시
   if (errorMessage) {
      return (
         <ErrorContainer>
            <p>오류: {errorMessage}</p>
            <RetryButton onClick={() => setErrorMessage(null)}>다시 시도</RetryButton>
         </ErrorContainer>
      )
   }

   // 피어 ID에서 사용자 ID 추출
   const extractUserId = (peerId) => {
      const match = peerId.match(/user-(\d+)-group-/)
      return match ? match[1] : peerId
   }

   // 사용자 ID로 멤버 정보 찾기
   const findMemberByUserId = (userId) => {
      return groupmembers?.find((member) => member.userId.toString() === userId)
   }

   return (
      <Container>
         {/* 제어 패널 */}
         <ControlPanel>
            {!isSharing ? <StartButton onClick={startScreenShare}>화면 공유 시작</StartButton> : <StopButton onClick={stopScreenShare}>화면 공유 중지</StopButton>}

            {/* 디버깅 정보 (개발 중에만 표시) */}
            <DebugInfo>
               연결 상태: {Object.keys(connectionRef.current).length}개 연결됨 | 피어 ID: {peerRef.current?.id || '연결 중...'}
            </DebugInfo>
         </ControlPanel>

         {/* 화면 표시 영역 */}
         <ScreenGrid>
            {/* 내 화면 (공유 중일 때만 표시) */}
            {isSharing && (
               <ScreenBox $isLocal={true}>
                  <Video
                     ref={(el) => {
                        videoRefs.current.local = el
                     }}
                     autoPlay
                     playsInline
                     muted
                  />
                  <Nickname>내 화면 (공유 중)</Nickname>
               </ScreenBox>
            )}

            {/* 다른 참가자 화면 */}
            {Object.entries(remoteStreams).map(([peerId, stream]) => {
               const userId = extractUserId(peerId)
               const member = findMemberByUserId(userId)
               const nickname = member?.User?.nickname || `사용자 ${userId}`

               return (
                  <ScreenBox key={peerId} $isLocal={false}>
                     <Video
                        ref={(el) => {
                           videoRefs.current[peerId] = el
                        }}
                        autoPlay
                        playsInline
                     />
                     <Nickname>{nickname}</Nickname>
                  </ScreenBox>
               )
            })}

            {/* 화면 공유 없을 때 안내 */}
            {!isSharing && Object.keys(remoteStreams).length === 0 && (
               <EmptyMessage>
                  화면 공유 중인 참가자가 없습니다. <br />
                  '화면 공유 시작' 버튼을 클릭하여 화면을 공유해보세요.
               </EmptyMessage>
            )}
         </ScreenGrid>

         {/* 참가자 목록 */}
         <ParticipantList>
            <h3>참가자 목록</h3>
            <ul>
               {groupmembers &&
                  groupmembers.map((member) => {
                     const isCurrentUser = member.userId === currentUser.id
                     const nickname = member.User?.nickname || `사용자 ${member.userId}`

                     // 화면 공유 중인지 확인
                     const memberIsSharing = isCurrentUser ? isSharing : Object.keys(remoteStreams).some((peerId) => extractUserId(peerId) === member.userId.toString())

                     return (
                        <ParticipantItem key={member.userId} $isCurrentUser={isCurrentUser}>
                           {nickname} {isCurrentUser && '(나)'}
                           {memberIsSharing && <ShareIcon>🖥️</ShareIcon>}
                        </ParticipantItem>
                     )
                  })}
            </ul>
         </ParticipantList>
      </Container>
   )
}

export default ScreenShare

// Styled Components
const Container = styled.div`
   display: flex;
   flex-direction: column;
   width: 100%;
   height: calc(100vh - 200px);
   min-height: 500px;
`

const ControlPanel = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   margin-bottom: 20px;
`

const StartButton = styled.button`
   background: #4caf50;
   color: white;
   border: none;
   border-radius: 4px;
   padding: 10px 20px;
   font-size: 16px;
   cursor: pointer;
   transition: background 0.3s;

   &:hover {
      background: #45a049;
   }
`

const StopButton = styled(StartButton)`
   background: #f44336;

   &:hover {
      background: #d32f2f;
   }
`

const DebugInfo = styled.div`
   font-size: 12px;
   color: #666;
   margin-left: 20px;
   background: #f5f5f5;
   padding: 5px 10px;
   border-radius: 4px;
`

const ScreenGrid = styled.div`
   display: grid;
   grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
   gap: 20px;
   flex: 1;
   overflow: auto;
   padding: 10px;
`

const ScreenBox = styled.div`
   position: relative;
   background: #000;
   border-radius: 8px;
   overflow: hidden;
   aspect-ratio: 16 / 9;
   border: 2px solid ${(props) => (props.$isLocal ? '#4caf50' : '#ddd')};
`

const Video = styled.video`
   width: 100%;
   height: 100%;
   object-fit: contain;
`

const Nickname = styled.div`
   position: absolute;
   bottom: 10px;
   left: 10px;
   background: rgba(0, 0, 0, 0.6);
   color: white;
   padding: 5px 10px;
   border-radius: 4px;
   font-size: 14px;
`

const EmptyMessage = styled.div`
   grid-column: 1 / -1;
   display: flex;
   justify-content: center;
   align-items: center;
   height: 300px;
   background: #f5f5f5;
   border-radius: 8px;
   text-align: center;
   color: #666;
   font-size: 16px;
   line-height: 1.6;
`

const ParticipantList = styled.div`
   width: 100%;
   margin-top: 20px;
   background-color: #f5f5f5;
   border-radius: 8px;
   padding: 15px;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

   h3 {
      margin-top: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
   }

   ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
   }
`

const ParticipantItem = styled.li`
   padding: 10px;
   background-color: ${(props) => (props.$isCurrentUser ? '#e3f2fd' : 'white')};
   border-radius: 4px;
   display: flex;
   align-items: center;
   justify-content: space-between;
   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
   min-width: 150px;
`

const ShareIcon = styled.span`
   margin-left: 8px;
   font-size: 16px;
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

const RetryButton = styled(StartButton)`
   margin-top: 20px;
`
