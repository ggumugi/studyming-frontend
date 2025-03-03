// import React, { useState, useEffect, useRef } from 'react'
// import { useSpring, animated } from '@react-spring/web'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchCaptchaThunk, verifyCaptchaThunk } from '../../features/captchaSlice'
// import styled from 'styled-components'

// const Timer = () => {
//    const [isMinimized, setIsMinimized] = useState(false)
//    const [time, setTime] = useState(0)
//    const [isAnimationDone, setIsAnimationDone] = useState(true)
//    const [userInput, setUserInput] = useState('')
//    const [count, setCount] = useState(3) // 초기 카운트 3
//    const [showCaptcha, setShowCaptcha] = useState(false) // 보안문자 입력창 표시 여부
//    const dispatch = useDispatch()
//    const { captcha, isLoading, error } = useSelector((state) => state.captcha)
//    const arrowRef = useRef(null)

//    const [{ bottom, right, width, height, opacity }, api] = useSpring(() => ({
//       bottom: 100,
//       right: 60,
//       width: 300,
//       height: 50,
//       opacity: 1,
//       config: { tension: 300, friction: 20 },
//    }))

//    useEffect(() => {
//       setTimeout(() => {
//          document.querySelector('.timer-box').style.height = '30px'
//       }, 100) // 100ms 후 강제 적용
//    }, [])

//    useEffect(() => {
//       const interval = setInterval(() => {
//          setTime((prevTime) => prevTime + 1)
//       }, 1000)

//       return () => clearInterval(interval)
//    }, [])

//    useEffect(() => {
//       if (time > 0 && time % 15 === 0) {
//          setIsMinimized(false)
//          dispatch(fetchCaptchaThunk())
//          setShowCaptcha(true)
//       }
//    }, [time, dispatch])

//    const handleVerifyCaptcha = () => {
//       if (captcha?.token) {
//          dispatch(verifyCaptchaThunk({ token: captcha.token, userInput }))
//          if (userInput === captcha.answer) {
//             // 정답 확인
//             alert('정답입니다.')
//             setShowCaptcha(false) // 입력창 숨기기
//             setCount(3) // 카운트 초기화
//          } else {
//             setCount((prevCount) => {
//                if (prevCount > 1) {
//                   return prevCount - 1
//                } else {
//                   alert('실패했습니다.')
//                   setShowCaptcha(false) // 입력창 숨기기
//                   return 3 // 카운트 초기화
//                }
//             })
//          }
//       }
//    }

//    const toggleMinimize = () => {
//       setIsMinimized((prev) => !prev)
//       setIsAnimationDone(false)

//       api.start({
//          width: isMinimized ? 300 : 0,
//          height: isMinimized ? 50 : 40,
//          opacity: isMinimized ? 1 : 0,
//          onRest: () => setIsAnimationDone(true),
//       })
//    }

//    const handleMouseDown = (e) => {
//       window.addEventListener('mousemove', handleMouseMove)
//       window.addEventListener('mouseup', handleMouseUp)
//    }

//    const handleMouseMove = (e) => {
//       api.start({
//          bottom: window.innerHeight - e.clientY - 25,
//          right: window.innerWidth - e.clientX - 40,
//          immediate: true,
//       })
//    }

//    const handleMouseUp = () => {
//       window.removeEventListener('mousemove', handleMouseMove)
//       window.removeEventListener('mouseup', handleMouseUp)
//    }

//    const formatTime = (totalSeconds) => {
//       const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
//       const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
//       const seconds = String(totalSeconds % 60).padStart(2, '0')
//       return `${hours}:${minutes}:${seconds}`
//    }

//    const timerAnimation = `
//       @keyframes minimizeTimer {
//          0% { height: 90px; width: 300px; }
//          50% { height: 40px; width: 300px; }
//          100% { height: 40px; width: 0; }
//       }

//       @keyframes maximizeTimer {
//          0% { height: 40px; width: 0; }
//          50% { height: 40px; width: 300px; }
//          100% { height: 90px; width: 300px; }
//       }

//       @keyframes captchaTimer {
//          0% { height: 40px; width: 0; }
//          50% { height: 40px; width: 320px; }
//          100% { height: 250px; width: 320px; }
//       }
//    `

//    return (
//       <Container>
//          <style>{timerAnimation}</style>
//          <animated.div
//             className="timer-box"
//             style={{
//                position: 'fixed',
//                bottom,
//                right: right.to((r) => r + 34),
//                padding: isMinimized ? '0' : '10px 20px',
//                width: '300px',
//                height,
//                backgroundColor: '#FF8C00',
//                color: '#fff',
//                borderRadius: '5px',
//                zIndex: 1000,
//                fontSize: isMinimized ? '0px' : '60px',
//                fontFamily: 'monospace',
//                overflow: 'hidden',
//                transition: 'all 0.1s ease',
//                animation: isMinimized ? 'minimizeTimer 0.8s forwards' : showCaptcha ? 'captchaTimer 0.8s forwards' : 'maximizeTimer 0.8s forwards',
//                textAlign: 'center',
//             }}
//          >
//             {isAnimationDone && !isMinimized && (
//                <>
//                   {showCaptcha && (
//                      <ul>
//                         <li>{captcha && <CaptchaImage src={`data:image/png;base64,${captcha.img}`} alt="Captcha" />}</li>
//                         <li>
//                            <CountText>입력 기회 : {count}</CountText> {/* 카운트 텍스트 스타일 */}
//                         </li>
//                         <li>
//                            <CaptchaInput type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
//                         </li>
//                         <li>
//                            <CaptchaButton onClick={handleVerifyCaptcha}>확인</CaptchaButton>
//                         </li>
//                      </ul>
//                   )}
//                   {!showCaptcha && <div>{formatTime(time)}</div>}
//                </>
//             )}
//          </animated.div>

//          <animated.button
//             ref={arrowRef}
//             onMouseDown={handleMouseDown}
//             onClick={toggleMinimize}
//             style={{
//                position: 'fixed',
//                bottom,
//                right,
//                width: '40px',
//                height: '40px',
//                backgroundColor: '#FF8C00',
//                color: 'white',
//                borderRadius: isMinimized ? '5px' : '0 5px 5px 0',
//                display: 'flex',
//                justifyContent: 'center',
//                alignItems: 'center',
//                fontSize: '24px',
//                border: 'none',
//                cursor: 'pointer',
//                transition: 'all 0.1s ease',
//                boxShadow: isMinimized ? '0 0 10px rgba(0,0,0,0.2)' : 'none',
//             }}
//          >
//             {isMinimized ? '●' : '○'}
//          </animated.button>
//       </Container>
//    )
// }

// export default Timer

// const Container = styled.div`
//    // display: flex;
//    // flex-direction: column;
//    // align-items: center;
// `

// const CaptchaImage = styled.img`
//    margin-top: 5px;
//    margin-bottom: 5px; /* 이미지와 텍스트 간의 간격 */
//    width: 100%; /* 이미지 크기 조정 */
//    max-width: 280px; /* 최대 너비 설정 */
// `

// const CountText = styled.div`
//    transform: translateY(5px);
//    font-size: 16px; /* 카운트 텍스트 크기 조정 */
// `

// const CaptchaInput = styled.input`
//    padding: 10px;
//    font-size: 16px;
//    width: 80%; /* 입력창 너비 */
//    border: 1px solid #ddd;
//    border-radius: 5px;
//    outline: none;
//    transform: translateY(-17px);
//    &:focus {
//       border-color: orange;
//    }
// `

// const CaptchaButton = styled.button`
//    padding: 10px 15px;
//    font-size: 16px;
//    border: none;
//    border-radius: 5px;
//    background-color: white;
//    color: #ff8c00;
//    cursor: pointer;
//    transition: background-color 0.3s;
//    transform: translateY(-35px);
//    &:hover {
//       background-color: #f0f0f0; /* 호버 시 배경색 변화 */
//    }
// `

import React, { useState, useEffect, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchCaptchaThunk, verifyCaptchaThunk } from '../../features/captchaSlice'
import { fetchGrouptimeThunk, updateGrouptimeThunk, captchaFailThunk } from '../../features/grouptimeSlice'
import { participateInGroupThunk } from '../../features/groupmemberSlice'
import styled from 'styled-components'

const Timer = () => {
   const { id: groupId } = useParams()
   const navigate = useNavigate()
   const [isMinimized, setIsMinimized] = useState(false)
   const [time, setTime] = useState(0)
   const [isAnimationDone, setIsAnimationDone] = useState(true)
   const [userInput, setUserInput] = useState('')
   const [count, setCount] = useState(3) // 초기 카운트 3
   const [showCaptcha, setShowCaptcha] = useState(false) // 보안문자 입력창 표시 여부
   const [captchaTimer, setCaptchaTimer] = useState(60) // 캡차 제한시간 (60초)
   const [captchaInterval, setCaptchaInterval] = useState(null) // 캡차 간격 (분)
   const [captchaTimerId, setCaptchaTimerId] = useState(null) // 캡차 타이머 ID
   const dispatch = useDispatch()
   const { captcha } = useSelector((state) => state.captcha)
   const { studygroup } = useSelector((state) => state.studygroups)
   const { grouptime } = useSelector((state) => state.grouptime)
   const arrowRef = useRef(null)

   const [{ bottom, right, width, height, opacity }, api] = useSpring(() => ({
      bottom: 100,
      right: 60,
      width: 300,
      height: 50,
      opacity: 1,
      config: { tension: 300, friction: 20 },
   }))

   // 초기 타이머 정보 가져오기
   useEffect(() => {
      if (groupId) {
         dispatch(fetchGrouptimeThunk(groupId))
            .unwrap()
            .then((result) => {
               if (result.grouptime && result.grouptime.time) {
                  // 시간 문자열(HH:MM:SS)을 초로 변환
                  const timeParts = result.grouptime.time.split(':')
                  const totalSeconds = parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2])
                  setTime(totalSeconds)
               }
            })
            .catch((error) => {
               console.error('타이머 정보 조회 실패:', error)
            })
      }
   }, [dispatch, groupId])

   // 스터디그룹 정보에서 캡차 간격 설정
   useEffect(() => {
      if (studygroup && studygroup.capInterval !== null) {
         setCaptchaInterval(studygroup.capInterval)
      }
   }, [studygroup])

   // 타이머 실행
   useEffect(() => {
      const interval = setInterval(() => {
         setTime((prevTime) => prevTime + 1)
      }, 1000)

      return () => clearInterval(interval)
   }, [])

   // 10분(600초) 간격으로 타이머 정보 저장
   useEffect(() => {
      if (groupId && time > 0 && time % 600 === 0) {
         const timeString = formatTime(time)
         dispatch(updateGrouptimeThunk({ groupId, time: timeString }))
            .unwrap()
            .catch((error) => {
               console.error('타이머 정보 업데이트 실패:', error)
            })
      }
   }, [time, dispatch, groupId])

   // 캡차 표시 (capInterval이 설정된 경우에만)
   useEffect(() => {
      if (captchaInterval && time > 0 && time % (captchaInterval * 60) === 0) {
         setIsMinimized(false)
         dispatch(fetchCaptchaThunk())
         setShowCaptcha(true)
         setCaptchaTimer(60) // 60초 제한시간 설정

         // 캡차 제한시간 타이머 시작
         const timerId = setInterval(() => {
            setCaptchaTimer((prev) => {
               if (prev <= 1) {
                  // 제한시간 종료 시 처리
                  clearInterval(timerId)
                  handleCaptchaTimeout()
                  return 0
               }
               return prev - 1
            })
         }, 1000)

         setCaptchaTimerId(timerId)
      }
   }, [time, dispatch, captchaInterval])

   // 컴포넌트 언마운트 시 캡차 타이머 정리
   useEffect(() => {
      return () => {
         if (captchaTimerId) {
            clearInterval(captchaTimerId)
         }
      }
   }, [captchaTimerId])

   // 캡차 제한시간 초과 처리
   const handleCaptchaTimeout = () => {
      // 스터디 그룹 참여 상태 변경 (off)
      dispatch(captchaFailThunk(groupId))
         .unwrap()
         .then(() => {
            alert('캡차 인증 시간이 초과되었습니다. 홈으로 이동합니다.')
            navigate('/home')
         })
         .catch((error) => {
            console.error('캡차 실패 처리 오류:', error)
            navigate('/home')
         })
   }

   const handleVerifyCaptcha = () => {
      if (captcha?.token) {
         dispatch(verifyCaptchaThunk({ token: captcha.token, userInput }))
            .unwrap()
            .then((result) => {
               if (result.isCorrect) {
                  // 서버에서 검증 성공 응답이 왔을 때
                  alert('정답입니다.')
                  setShowCaptcha(false) // 입력창 숨기기
                  setCount(3) // 카운트 초기화

                  // 캡차 타이머 정리
                  if (captchaTimerId) {
                     clearInterval(captchaTimerId)
                     setCaptchaTimerId(null)
                  }
               } else {
                  // 서버에서 검증 실패 응답이 왔을 때
                  setCount((prevCount) => {
                     if (prevCount > 1) {
                        return prevCount - 1
                     } else {
                        // 모든 기회 소진 시 처리
                        if (captchaTimerId) {
                           clearInterval(captchaTimerId)
                           setCaptchaTimerId(null)
                        }

                        // 스터디 그룹 참여 상태 변경 (off)
                        dispatch(captchaFailThunk(groupId))
                           .unwrap()
                           .then(() => {
                              alert('캡차 인증에 실패했습니다. 홈으로 이동합니다.')
                              navigate('/home')
                           })
                           .catch((error) => {
                              console.error('캡차 실패 처리 오류:', error)
                              navigate('/home')
                           })
                        return 3 // 카운트 초기화
                     }
                  })
               }
               setUserInput('') // 입력 필드 초기화
            })
            .catch((error) => {
               console.error('캡차 검증 중 오류 발생:', error)
               setUserInput('') // 입력 필드 초기화
            })
      }
   }

   const toggleMinimize = () => {
      setIsMinimized((prev) => !prev)
      setIsAnimationDone(false)

      api.start({
         width: isMinimized ? 300 : 0,
         height: isMinimized ? 50 : 40,
         opacity: isMinimized ? 1 : 0,
         onRest: () => setIsAnimationDone(true),
      })
   }

   const handleMouseDown = (e) => {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
   }

   const handleMouseMove = (e) => {
      api.start({
         bottom: window.innerHeight - e.clientY - 25,
         right: window.innerWidth - e.clientX - 40,
         immediate: true,
      })
   }

   const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
   }

   const formatTime = (totalSeconds) => {
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
      const seconds = String(totalSeconds % 60).padStart(2, '0')
      return `${hours}:${minutes}:${seconds}`
   }

   const timerAnimation = `
      @keyframes minimizeTimer {
         0% { height: 90px; width: 300px; }
         50% { height: 40px; width: 300px; }
         100% { height: 40px; width: 0; }
      }

      @keyframes maximizeTimer {
         0% { height: 40px; width: 0; }
         50% { height: 40px; width: 300px; }
         100% { height: 90px; width: 300px; }
      }

      @keyframes captchaTimer {
         0% { height: 40px; width: 0; }
         50% { height: 40px; width: 320px; }
         100% { height: 280px; width: 320px; }
      }
   `

   return (
      <Container>
         <style>{timerAnimation}</style>
         <animated.div
            className="timer-box"
            style={{
               position: 'fixed',
               bottom,
               right: right.to((r) => r + 34),
               padding: isMinimized ? '0' : '10px 20px',
               width: '300px',
               height,
               backgroundColor: '#FF8C00',
               color: '#fff',
               borderRadius: '5px',
               zIndex: 1000,
               fontSize: isMinimized ? '0px' : '60px',
               fontFamily: 'monospace',
               overflow: 'hidden',
               transition: 'all 0.1s ease',
               animation: isMinimized ? 'minimizeTimer 0.8s forwards' : showCaptcha ? 'captchaTimer 0.8s forwards' : 'maximizeTimer 0.8s forwards',
               textAlign: 'center',
            }}
         >
            {isAnimationDone && !isMinimized && (
               <>
                  {showCaptcha && (
                     <ul>
                        <li>{captcha && <CaptchaImage src={`data:image/png;base64,${captcha.img}`} alt="Captcha" />}</li>
                        <li>
                           <CountText>
                              입력 기회: {count} | 남은 시간: {captchaTimer}초
                           </CountText>
                        </li>
                        <li>
                           <CaptchaInput type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="보안문자를 입력하세요" />
                        </li>
                        <li>
                           <CaptchaButton onClick={handleVerifyCaptcha}>확인</CaptchaButton>
                        </li>
                     </ul>
                  )}
                  {!showCaptcha && <div>{formatTime(time)}</div>}
               </>
            )}
         </animated.div>

         <animated.button
            ref={arrowRef}
            onMouseDown={handleMouseDown}
            onClick={toggleMinimize}
            style={{
               position: 'fixed',
               bottom,
               right,
               width: '40px',
               height: '40px',
               backgroundColor: '#FF8C00',
               color: 'white',
               borderRadius: isMinimized ? '5px' : '0 5px 5px 0',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               fontSize: '24px',
               border: 'none',
               cursor: 'pointer',
               transition: 'all 0.1s ease',
               boxShadow: isMinimized ? '0 0 10px rgba(0,0,0,0.2)' : 'none',
            }}
         >
            {isMinimized ? '●' : '○'}
         </animated.button>
      </Container>
   )
}

export default Timer

const Container = styled.div`
   // 컨테이너 스타일링
`

const CaptchaImage = styled.img`
   margin-top: 5px;
   margin-bottom: 5px;
   width: 100%;
   max-width: 280px;
`

const CountText = styled.div`
   transform: translateY(5px);
   font-size: 16px;
   margin-bottom: 10px;
`

const CaptchaInput = styled.input`
   padding: 10px;
   font-size: 16px;
   width: 80%;
   border: 1px solid #ddd;
   border-radius: 5px;
   outline: none;
   transform: translateY(-10px);
   &:focus {
      border-color: orange;
   }
`

const CaptchaButton = styled.button`
   padding: 10px 15px;
   font-size: 16px;
   border: none;
   border-radius: 5px;
   background-color: white;
   color: #ff8c00;
   cursor: pointer;
   transition: background-color 0.3s;
   transform: translateY(-5px);
   margin-top: 10px;
   &:hover {
      background-color: #f0f0f0;
   }
`
