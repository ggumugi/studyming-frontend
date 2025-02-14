import React from 'react'
import '../../styles/studyTimeCard.css' // ✅ 외부 CSS 파일 불러오기

const TotalTimeCard = ({ title }) => {
   return (
      <div className="study-time-card">
         <div className="title-container">
            <h3 className="title">{title}</h3>
            <div className="underline"></div>
         </div>
         <span className="time-display">00:00</span> {/* ⬅️ 여기에 시간 표시 */}
      </div>
   )
}
/* 오늘 & 어제 & 총 공부시간 카드 디자인 동일하지만 내용이 달라서
스타일 컴포넌트가 아닌 외부 CSS로 사용  */

export default TotalTimeCard
