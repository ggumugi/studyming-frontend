// import React, { useState, useEffect } from 'react'

// const Timer = () => {
//    const [isMinimized, setIsMinimized] = useState(false)
//    const [time, setTime] = useState(0) // 타이머의 초기 시간은 0
//    const [isAnimationDone, setIsAnimationDone] = useState(false) // 애니메이션 끝났는지 확인

//    // 타이머 업데이트 (최소화 상태에서도 타이머는 계속 진행)
//    useEffect(() => {
//       const interval = setInterval(() => {
//          setTime((prevTime) => prevTime + 1)
//       }, 1000)

//       return () => clearInterval(interval)
//    }, []) // 의존성 배열에 isMinimized를 추가하지 않아서 계속 진행됨

//    const toggleMinimize = () => {
//       setIsMinimized((prevState) => !prevState)
//       setIsAnimationDone(false) // 애니메이션 시작 시 초기화
//    }

//    // 시간 포맷팅
//    const formatTime = (totalSeconds) => {
//       const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
//       const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
//       const seconds = String(totalSeconds % 60).padStart(2, '0')
//       return `${hours}:${minutes}:${seconds}`
//    }

//    // 애니메이션 끝났을 때 처리
//    const handleAnimationEnd = () => {
//       setIsAnimationDone(true) // 애니메이션 끝난 후 시간 표시
//    }

//    // 애니메이션 정의
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
//    `

//    return (
//       <div>
//          <style>{timerAnimation}</style>
//          {/* 타이머 */}
//          <div
//             onAnimationEnd={handleAnimationEnd} // 애니메이션 끝날 때 이벤트 처리
//             style={{
//                position: 'fixed',
//                bottom: isMinimized ? '10px' : '100px',
//                right: '60px',
//                padding: isMinimized ? '0' : '10px 20px',
//                width: '300px',
//                height: '90px',
//                backgroundColor: '#FF8C00',
//                color: '#fff',
//                borderRadius: '5px',
//                zIndex: 1000,
//                fontSize: isMinimized ? '0px' : '60px',
//                fontFamily: 'monospace',
//                overflow: 'hidden',
//                transition: 'all 0.8s ease',
//                animation: isMinimized ? 'minimizeTimer 0.8s forwards' : 'maximizeTimer 0.8s forwards',
//                textAlign: 'center',
//             }}
//          >
//             {/* 타이머 숫자 */}
//             {isAnimationDone && !isMinimized && <div>{formatTime(time)}</div>} {/* 애니메이션 끝나면 시간 표시 */}
//          </div>

//          {/* 화살표 버튼 */}
//          <button
//             onClick={toggleMinimize}
//             style={{
//                position: 'fixed',
//                bottom: isMinimized ? '10px' : '100px',
//                right: '23px',
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
//                transition: 'all 0.8s ease',
//                boxShadow: isMinimized ? 'none' : '0 0 10px rgba(0,0,0,0.2)',
//             }}
//          >
//             {isMinimized ? '↑' : '↓'}
//          </button>
//       </div>
//    )
// }

// export default Timer

import React, { useState, useEffect, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'

const Timer = () => {
   const [isMinimized, setIsMinimized] = useState(false)
   const [time, setTime] = useState(0)
   const [isDrag, setIsDrag] = useState(false)
   const [isAnimationDone, setIsAnimationDone] = useState(true)
   const arrowRef = useRef(null)

   const [{ bottom, right, width, height, opacity }, api] = useSpring(() => ({
      bottom: 100,
      right: 60,
      width: 300,
      height: 90,
      opacity: 1,
      config: { tension: 300, friction: 20 },
   }))

   useEffect(() => {
      const interval = setInterval(() => {
         setTime((prevTime) => prevTime + 1)
      }, 1000)

      return () => clearInterval(interval)
   }, [])

   const toggleMinimize = () => {
      setIsMinimized((prev) => !prev)
      setIsAnimationDone(false)

      api.start({
         width: isMinimized ? 300 : 0,
         height: isMinimized ? 90 : 40,
         opacity: isMinimized ? 1 : 0,
         onRest: () => setIsAnimationDone(true), // 애니메이션 종료 후 상태 변경
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
   `

   return (
      <div>
         <style>{timerAnimation}</style>
         <animated.div
            style={{
               position: 'fixed',
               bottom,
               right: right.to((r) => r + 34),
               padding: isMinimized ? '0' : '10px 20px',
               width: '300px',
               height: '90px',
               backgroundColor: '#FF8C00',
               color: '#fff',
               borderRadius: '5px',
               zIndex: 1000,
               fontSize: isMinimized ? '0px' : '60px',
               fontFamily: 'monospace',
               overflow: 'hidden',
               transition: 'all 0.1s ease',
               animation: isMinimized ? 'minimizeTimer 0.8s forwards' : 'maximizeTimer 0.8s forwards',
               textAlign: 'center',
            }}
         >
            {isAnimationDone && !isMinimized && <div>{formatTime(time)}</div>}
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
               boxShadow: isMinimized ? 'none' : '0 0 10px rgba(0,0,0,0.2)',
            }}
         >
            {isMinimized ? '●' : '○'}
         </animated.button>
      </div>
   )
}

export default Timer
