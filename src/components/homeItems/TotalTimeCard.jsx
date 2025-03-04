import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllTimeData, fetchTimeData } from '../../features/timeSlice'
import '../../styles/studyTimeCard.css'

const TotalTimeCard = ({ user, title }) => {
   const dispatch = useDispatch()
   const { allTime, time, loading } = useSelector((state) => state.time)

   useEffect(() => {
      if (user) {
         dispatch(fetchAllTimeData(user.id))
         dispatch(fetchTimeData(user.id))
      }
   }, [dispatch, user])

   // "HH:MM:SS" → 초 단위 변환 함수
   const timeToSeconds = (timeString) => {
      if (!timeString) return 0
      const [hours, minutes, seconds] = timeString.split(':').map(Number)
      return (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0)
   }

   // 초 단위 → "HH:MM:SS" 변환 함수
   const secondsToTime = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
   }

   // 두 시간을 초로 변환 후 합산
   const totalSeconds = timeToSeconds(allTime) + timeToSeconds(time)
   const totalStudyTime = secondsToTime(totalSeconds)

   return (
      <div className="study-time-card">
         <div className="title-container">
            <h3 className="title">{title}</h3>
            <div className="underline"></div>
         </div>
         <span className="time-display">{loading ? '로딩 중...' : totalStudyTime}</span>
      </div>
   )
}

export default TotalTimeCard
