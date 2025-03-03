import React, { useEffect, useState, useRef } from 'react'
import { JitsiMeeting } from '@jitsi/react-sdk'
import { useDispatch, useSelector } from 'react-redux'
import { updateGroupMemberThunk, participateInGroupThunk } from '../../features/groupmemberSlice'
import styled from 'styled-components'

const ScreenShare = ({ studygroup, groupmembers }) => {
   const dispatch = useDispatch()
   const user = useSelector((state) => state.auth.user)
   const [api, setApi] = useState(null)
   const [isScreenSharing, setIsScreenSharing] = useState(false)
   const [statusMessage, setStatusMessage] = useState('')
   const jitsiIframeRef = useRef(null)
   const localStreamRef = useRef(null) // 로컬 캠 스트림을 저장할 참조

   // 현재 사용자의 그룹 멤버 정보 찾기
   const currentMember = groupmembers?.find((member) => member.userId === user?.id)

   const leaderMember = groupmembers?.find((member) => member.role === 'leader')

   // 그룹 ID를 회의실 ID로 사용
   const roomName = `studyming_${studygroup?.id}_room`

   useEffect(() => {
      // 참가자 상태를 'on'으로 설정
      if (currentMember && currentMember.status !== 'on') {
         dispatch(
            participateInGroupThunk({
               groupId: studygroup.id,
               status: 'on',
            })
         )
      }

      // 컴포넌트 언마운트 시 화면 공유 상태 초기화
      return () => {
         if (currentMember && currentMember.shareState) {
            dispatch(
               updateGroupMemberThunk({
                  groupId: studygroup.id,
                  userId: user.id,
                  updateData: { shareState: false },
               })
            )
         }

         // 참가자 상태를 'off'로 설정
         if (currentMember && currentMember.status === 'on') {
            dispatch(
               participateInGroupThunk({
                  groupId: studygroup.id,
                  status: 'off',
               })
            )
         }
      }
   }, [currentMember, dispatch, studygroup.id, user.id])

   const handleApiReady = (apiObj) => {
      setApi(apiObj)
      console.log('Jitsi API 준비 완료')

      // 초기 설정 - 비디오 비활성화
      apiObj.executeCommand('toggleVideo')

      // 참가자 수 제한 (최대 6명)
      apiObj.addEventListener('participantJoined', (event) => {
         console.log('참가자 입장:', event)
         const participants = apiObj.getParticipantsInfo()
         console.log('현재 참가자 수:', participants.length)

         if (participants.length > 6) {
            alert('최대 6명까지만 참여할 수 있습니다.')
            apiObj.executeCommand('hangup')
         }
      })

      // 화면 공유 상태 변경 이벤트 감지
      apiObj.addEventListener('screenSharingStatusChanged', (event) => {
         console.log('화면 공유 상태 변경:', event)
         setIsScreenSharing(event.on)

         // DB에 화면 공유 상태 업데이트
         if (currentMember) {
            dispatch(
               updateGroupMemberThunk({
                  groupId: studygroup.id,
                  userId: user.id,
                  updateData: { shareState: event.on },
               })
            )
         }

         if (event.on) {
            setStatusMessage('화면 공유 중')
         } else {
            setStatusMessage('화면 공유가 중지되었습니다')
            setTimeout(() => {
               setStatusMessage('')
            }, 3000)
         }
      })

      // 회의 참가 완료 이벤트
      apiObj.addEventListener('videoConferenceJoined', (event) => {
         console.log('회의 참가 완료:', event)
         setStatusMessage('회의에 참가했습니다')
         setTimeout(() => {
            setStatusMessage('')
         }, 3000)
      })

      // 오류 이벤트
      apiObj.addEventListener('errorOccurred', (error) => {
         console.error('Jitsi 오류 발생:', error)
         setStatusMessage(`오류: ${error.error}`)
      })
   }

   const handleScreenShare = async () => {
      if (!api) {
         console.error('Jitsi API가 준비되지 않았습니다.')
         setStatusMessage('Jitsi가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.')
         return
      }

      console.log('화면 공유 버튼 클릭됨, 현재 상태:', isScreenSharing)

      try {
         // 이미 공유 중이면 중지
         if (isScreenSharing) {
            api.executeCommand('toggleShareScreen')
            return
         }

         // 화면 공유 권한 요청
         setStatusMessage('화면 공유 권한 요청 중...')

         try {
            // 사용자에게 화면 공유 권한 요청
            const stream = await navigator.mediaDevices.getDisplayMedia({
               video: {
                  cursor: 'always',
               },
               audio: false,
            })

            console.log('화면 공유 권한 허용됨')
            setStatusMessage('화면 공유 권한이 허용되었습니다. 공유를 시작합니다...')

            // Jitsi의 비디오 트랙을 교체
            api.executeCommand('replaceTrack', stream.getVideoTracks()[0])

            // 화면 공유 종료 감지
            stream.getVideoTracks()[0].addEventListener('ended', () => {
               console.log('사용자가 화면 공유를 종료했습니다.')
               setIsScreenSharing(false)

               // DB에 화면 공유 상태 업데이트
               if (currentMember) {
                  dispatch(
                     updateGroupMemberThunk({
                        groupId: studygroup.id,
                        userId: user.id,
                        updateData: { shareState: false },
                     })
                  )
               }

               setStatusMessage('화면 공유가 종료되었습니다.')
               setTimeout(() => {
                  setStatusMessage('')
               }, 3000)
            })

            // Jitsi 화면 공유 명령 실행
            api.executeCommand('toggleShareScreen')
         } catch (permissionError) {
            console.error('화면 공유 권한 오류:', permissionError)
            setStatusMessage('화면 공유 권한이 거부되었습니다.')

            if (permissionError.name === 'NotAllowedError') {
               alert('화면 공유 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.')
            } else {
               alert(`화면 공유 오류: ${permissionError.message}`)
            }
         }
      } catch (error) {
         console.error('화면 공유 중 오류 발생:', error)
         setStatusMessage(`화면 공유 오류: ${error.message}`)
         alert('화면 공유를 시작할 수 없습니다. 브라우저 콘솔에서 오류를 확인해주세요.')
      }
   }

   return (
      <Container>
         <MeetingContainer>
            {statusMessage && <StatusMessage>{statusMessage}</StatusMessage>}

            <JitsiMeeting
               domain="meet.jit.si"
               roomName={roomName}
               configOverwrite={{
                  startWithAudioMuted: true,
                  startWithVideoMuted: true,
                  prejoinPageEnabled: false,
                  disableDeepLinking: true,
                  disableInitialGUM: true,
                  toolbarButtons: [
                     'microphone',
                     'camera',
                     'desktop', // 화면 공유 버튼 추가
                     'hangup',
                     'participants-pane',
                     'settings',
                  ],
                  desktopSharingEnabled: true,
                  desktopSharingChromeEnabled: true,
                  desktopSharingFirefoxEnabled: true,
                  enableInsecureRoomNameWarning: false,
                  desktopSharingFrameRate: {
                     min: 5,
                     max: 30,
                  },
                  hideConferenceSubject: true,
                  hideConferenceTimer: false,
                  defaultLocalDisplayName: user?.nickname || '사용자',
                  watermark: {
                     enabled: false,
                     logo: '',
                  },
                  backgroundColor: '#000000',
               }}
               interfaceConfigOverwrite={{
                  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                  SHOW_JITSI_WATERMARK: false,
                  SHOW_WATERMARK_FOR_GUESTS: false,
                  DEFAULT_BACKGROUND: '#000000',
                  DEFAULT_LOCAL_DISPLAY_NAME: user?.nickname || '사용자',
                  TOOLBAR_BUTTONS: [
                     'microphone',
                     'camera',
                     'desktop', // 화면 공유 버튼 추가
                     'hangup',
                     'participants-pane',
                  ],
                  SHARING_FEATURES: ['desktop'],
                  SETTINGS_SECTIONS: ['devices', 'language', 'moderator'],
                  DESKTOP_SHARING_ENABLE_LOCALHOST: true,
               }}
               userInfo={{
                  displayName: user?.nickname || '사용자',
               }}
               onApiReady={handleApiReady}
               getIFrameRef={(iframeRef) => {
                  if (iframeRef) {
                     jitsiIframeRef.current = iframeRef
                     iframeRef.style.height = '600px'
                     iframeRef.style.backgroundColor = '#000000'

                     // iframe 로드 후 스타일 적용 시도
                     iframeRef.onload = () => {
                        try {
                           const iframeDocument = iframeRef.contentWindow.document
                           const style = document.createElement('style')
                           style.textContent = `
                    body { background-color: #000 !important; }
                  `
                           iframeDocument.head.appendChild(style)
                        } catch (e) {
                           console.warn('iframe 스타일 적용 실패:', e)
                        }
                     }
                  }
               }}
            />
         </MeetingContainer>

         <SidePanel>
            <PanelTitle>참가자 ({groupmembers?.length || 0}/6)</PanelTitle>
            {groupmembers.map((member) => (
               <ParticipantItem key={member.userId}>
                  <ParticipantName>
                     {member.User?.nickname || '사용자'}
                     {member.role === 'leader' && <LeaderBadge>방장</LeaderBadge>}
                  </ParticipantName>
                  <ParticipantStatus>{member.status === 'on' ? '접속 중' : '오프라인'}</ParticipantStatus>
               </ParticipantItem>
            ))}
            {!leaderMember && <NoLeaderWarning>현재 방장이 없습니다. 모든 참가자가 회의에 참여할 수 있습니다.</NoLeaderWarning>}
         </SidePanel>
      </Container>
   )
}

export default ScreenShare

// 스타일 컴포넌트
const Container = styled.div`
   display: flex;
   height: calc(100vh - 200px);
   gap: 20px;
`

const MeetingContainer = styled.div`
   position: relative;
   flex: 1;
   background-color: #000;
   border-radius: 10px;
   overflow: hidden;

   & iframe {
      background-color: #000;
      border-radius: 10px;
      width: 100%;
   }
`

const StatusMessage = styled.div`
   position: absolute;
   top: 10px;
   left: 50%;
   transform: translateX(-50%);
   background-color: rgba(0, 0, 0, 0.7);
   color: white;
   padding: 8px 16px;
   border-radius: 20px;
   font-size: 14px;
   z-index: 100;
`

const SidePanel = styled.div`
   width: 250px;
   background-color: #f5f5f5;
   border-radius: 10px;
   padding: 15px;
   overflow-y: auto;
`

const PanelTitle = styled.h3`
   margin-top: 0;
   padding-bottom: 10px;
   border-bottom: 1px solid #ddd;
   color: #333;
`

const ParticipantsList = styled.ul`
   list-style: none;
   padding: 0;
   margin: 0;
`

const ParticipantItem = styled.li`
   padding: 10px;
   margin-bottom: 8px;
   border-radius: 8px;
   background-color: #fff;
   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`

const ParticipantName = styled.div`
   font-weight: bold;
   display: flex;
   align-items: center;
   gap: 5px;
`

const LeaderBadge = styled.span`
   background-color: #ff7a00;
   color: white;
   font-size: 11px;
   padding: 2px 6px;
   border-radius: 10px;
`

const ParticipantStatus = styled.div`
   font-size: 12px;
   color: #666;
   margin-top: 3px;
`

const ParticipantInfo = styled.div`
   padding: 15px;
   text-align: center;
   color: #666;
`

const NoLeaderWarning = styled.div`
   margin-top: 15px;
   padding: 10px;
   background-color: #fff3cd;
   border-radius: 5px;
   font-size: 12px;
   color: #856404;
   text-align: center;
`
