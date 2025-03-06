import React, { useEffect, useState, useRef } from 'react'
import { JitsiMeeting } from '@jitsi/react-sdk'
import { useDispatch, useSelector } from 'react-redux'
import { updateGroupMemberThunk } from '../../features/groupmemberSlice'
import styled from 'styled-components'

// 배포 환경의 도메인 설정
const JITSI_DOMAIN = 'meet.jit.si' // 공개 Jitsi 서버 사용
const APP_DOMAIN = 'http://ec2-13-125-242-248.ap-northeast-2.compute.amazonaws.com'

const ScreenShare = ({ studygroup, groupmembers }) => {
   const dispatch = useDispatch()
   const user = useSelector((state) => state.auth.user)
   const [api, setApi] = useState(null)
   const [isScreenSharing, setIsScreenSharing] = useState(false)
   const [statusMessage, setStatusMessage] = useState('')
   const jitsiIframeRef = useRef(null)

   // 데이터가 없을 때 안전하게 처리
   const safeGroupmembers = groupmembers || []

   // 현재 사용자의 그룹 멤버 정보 찾기
   const currentMember = safeGroupmembers.find((member) => member.userId === user?.id)
   const leaderMember = safeGroupmembers.find((member) => member.role === 'leader')

   // 그룹 ID와 도메인을 결합하여 고유한 회의실 ID 생성
   // 배포 환경의 도메인을 포함시켜 다른 Jitsi 서버와 충돌 방지
   const roomName = `studyming_${APP_DOMAIN.replace(/[^a-zA-Z0-9]/g, '_')}_${studygroup?.id}_room`

   useEffect(() => {
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
      }
   }, [currentMember, dispatch, studygroup?.id, user?.id])

   const handleApiReady = (apiObj) => {
      setApi(apiObj)

      // 초기 설정 - 비디오 비활성화
      apiObj.executeCommand('toggleVideo')

      // 참가자 수 제한 (최대 6명)
      apiObj.addEventListener('participantJoined', (event) => {
         const participants = apiObj.getParticipantsInfo()

         if (participants.length > 6) {
            alert('최대 6명까지만 참여할 수 있습니다.')
            apiObj.executeCommand('hangup')
         }
      })

      // 화면 공유 상태 변경 이벤트 감지
      apiObj.addEventListener('screenSharingStatusChanged', (event) => {
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

            setStatusMessage('화면 공유 권한이 허용되었습니다. 공유를 시작합니다...')

            // Jitsi의 비디오 트랙을 교체
            api.executeCommand('replaceTrack', stream.getVideoTracks()[0])

            // 화면 공유 종료 감지
            stream.getVideoTracks()[0].addEventListener('ended', () => {
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

   // 데이터가 로드되지 않았을 때 로딩 표시
   if (!studygroup || !groupmembers) {
      return <LoadingContainer>데이터를 불러오는 중입니다...</LoadingContainer>
   }

   return (
      <MeetingContainer>
         {statusMessage && <StatusMessage>{statusMessage}</StatusMessage>}

         <JitsiMeeting
            domain={JITSI_DOMAIN}
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
               // 배포 환경에 맞는 추가 설정
               disableThirdPartyRequests: false,
               analytics: {
                  disabled: true,
               },
               // 서버 연결 관련 설정
               websocket: 'wss://meet-jit-si-turnrelay.jitsi.net/colibri-ws/default-id/studyming',
               p2p: {
                  enabled: true,
                  preferH264: true,
               },
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
               // 배포 환경에 맞는 추가 설정
               MOBILE_APP_PROMO: false,
               HIDE_INVITE_MORE_HEADER: true,
               DISABLE_FOCUS_INDICATOR: true,
               DISABLE_VIDEO_BACKGROUND: true,
            }}
            userInfo={{
               displayName: user?.nickname || '사용자',
               email: user?.email || '',
               avatarUrl: '', // 사용자 아바타 URL (선택적)
            }}
            onApiReady={handleApiReady}
            getIFrameRef={(iframeRef) => {
               if (iframeRef) {
                  jitsiIframeRef.current = iframeRef
                  iframeRef.style.height = '100%'
                  iframeRef.style.width = '100%'
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
   )
}

export default ScreenShare

// 스타일 컴포넌트
const LoadingContainer = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 50vh;
   font-size: 18px;
   color: #666;
`

const MeetingContainer = styled.div`
   position: relative;
   flex: 1;
   background-color: #000;
   border-radius: 10px;
   overflow: hidden;
   height: calc(100vh - 200px);

   & iframe {
      background-color: #000;
      border-radius: 10px;
      width: 100%;
      height: 100%;
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
