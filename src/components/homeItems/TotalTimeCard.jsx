import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAllTimeData } from '../../features/timeSlice'
import '../../styles/studyTimeCard.css'

const TotalTimeCard = ({ userId, title }) => {
   const dispatch = useDispatch()
   const { allTime, loading } = useSelector((state) => state.time)

   useEffect(() => {
      if (userId) dispatch(fetchAllTimeData(userId))
   }, [dispatch, userId])

   return (
      <div className="study-time-card">
         <div className="title-container">
            <h3 className="title">{title}</h3>
            <div className="underline"></div>
         </div>
         <span className="time-display">{loading ? '로딩 중...' : allTime}</span>
      </div>
   )
}
/* 오늘 & 어제 & 총 공부시간 카드 디자인 동일하지만 내용이 달라서
스타일 컴포넌트가 아닌 외부 CSS로 사용  */
export default TotalTimeCard
