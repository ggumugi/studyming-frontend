import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Report = ({ isOpen, onClose, onReport, targetUser }) => {
   const [selectedReason, setSelectedReason] = useState('')

   const handleReportSubmit = () => {
      if (!selectedReason) {
         alert('신고 사유를 선택해주세요.')
         return
      }
      onReport(selectedReason) // ✅ 선택한 신고 사유 전달
   }

   if (!isOpen) return null

   return (
      <ModalOverlay>
         <ModalContent>
            <CloseButton onClick={onClose}>×</CloseButton> {/* X 버튼 추가 */}
            <Title>신고하기</Title>
            <Nickname>닉네임 : {targetUser?.nickname}</Nickname>
            <ReasonList>
               {['스팸홍보/도배입니다.', '음란물입니다.', '불법정보 포함', '욕설/혐오 표현', '개인정보 노출', '불쾌한 표현', '명예훼손/저작권 침해', '불법촬영물'].map((reason) => (
                  <Reason key={reason}>
                     <input type="radio" value={reason} checked={selectedReason === reason} onChange={() => setSelectedReason(reason)} />
                     {reason}
                  </Reason>
               ))}
            </ReasonList>
            <Button onClick={handleReportSubmit}>신고하기</Button>
         </ModalContent>
      </ModalOverlay>
   )
}

export default Report

// Styled Components
const ModalOverlay = styled.div`
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   background-color: rgba(0, 0, 0, 0.6); /* 약간 어두운 오버레이 */
   display: flex;
   justify-content: center;
   align-items: center;
   z-index: 1000;
`

const ModalContent = styled.div`
   background-color: white;
   padding: 25px;
   border-radius: 10px;
   width: 450px; /* 크기 약간 확장 */
   text-align: left;
   position: relative; /* 상대 위치 설정 */
   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 그림자 추가 */
`

const CloseButton = styled.button`
   position: absolute;
   top: 10px;
   right: 25px;
   background: none;
   border: none;
   font-size: 35px;
   color: #ff7a00;
   cursor: pointer;
   padding: 0;
   transition: color 0.2s;
   font-weight: 300;

   &:hover {
      color: #e55a00; /* hover 효과 추가 */
   }
`

const Title = styled.h2`
   text-align: center;
   font-size: 22px;
   margin-top: 10px;
   margin-bottom: 15px;
   color: #333;
`

const Nickname = styled.p`
   text-align: right;
   font-weight: 400;
   font-size: 14px;
   padding-left: 10px;
   color: #555;
   margin-bottom: 20px; /* 간격 추가 */
`

const ReasonList = styled.div`
   margin-bottom: 20px;
`

const Reason = styled.label`
   display: flex;
   align-items: center; /* 텍스트와 라디오 버튼을 세로로 가운데 정렬 */
   margin-bottom: 12px;
   font-size: 16px;
   cursor: pointer;
   color: #222;
   padding: 10px 0; /* 상하 패딩만 맞추기 */
   border-radius: 5px;
   transition: background-color 0.3s ease;

   input {
      margin-right: 12px;
      accent-color: #000;
      outline: none;
      width: 10px;
      height: 10px;
   }
`

const Button = styled.button`
   width: 100%;
   padding: 12px 0; /* 상하 패딩을 맞추어 높이를 통일 */
   border: none;
   background-color: #ff7a00;
   color: white;
   border-radius: 5px;
   cursor: pointer;
   font-size: 16px;
   transition: background-color 0.3s;

   &:hover {
      background-color: #e55a00;
   }
`
const SuccessModal = styled.div`
   position: absolute;
   bottom: 20px;
   left: 50%;
   transform: translateX(-50%);
   background-color: #2ecc71;
   color: white;
   padding: 10px 20px;
   border-radius: 5px;
   font-size: 16px;
   font-weight: bold;
   text-align: center;
   animation: fadeIn 0.5s;
`
const ErrorText = styled.p`
   color: red;
   text-align: center;
   margin-top: 10px;
`

// 사용 방법
// import Report from ~~

//  const [isModalOpen, setIsModalOpen] = useState(false)

//  const handleReportClick = () => {
//     setIsModalOpen(true) // 신고 버튼 클릭 시 모달 열기
//  }

//  const handleCloseModal = () => {
//     setIsModalOpen(false) // 모달 닫기
//  }

//  const handleReport = () => {
//     console.log('사용자를 신고했습니다.')
//     // 신고 로직 처리 (예: 서버로 신고 정보 전송)
//     setIsModalOpen(false) // 신고 후 모달 닫기
//  }

//  return (
//     <div>
//        <button onClick={handleReportClick}>사용자 신고</button>

//        <Modal isOpen={isModalOpen} onClose={handleCloseModal} onReport={handleReport} />
//     </div>
//  )
