import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import styled from 'styled-components'

const StudyLeaderTransfer = () => {
   const [members, setMembers] = useState([]) // ✅ 초기값을 빈 배열로 설정
   const [selectedLeader, setSelectedLeader] = useState('')

   useEffect(() => {
      // 예제: 백엔드에서 데이터 가져오기 (실제 API로 변경해야 함)
      setTimeout(() => {
         setMembers(['원빈', '우지박', '블랙쉐도우', '듀가나디'])
      }, 1000)
   }, [])

   const handleLeaderChange = (e) => {
      setSelectedLeader(e.target.value)
   }

   const navigate = useNavigate() // ✅ 내비게이트 훅 사용

   const handleTransfer = () => {
      if (!selectedLeader) {
         alert('위임할 방장을 선택하세요.')
         return
      }
      alert(`${selectedLeader}님에게 방장을 위임합니다.`)
      // TODO: 백엔드 API 연결 (스터디 방장 위임 로직)
      // ✅ 방장 위임 후 특정 페이지로 이동
      navigate('/study/leader/exit')
   }

   if (!members.length) {
      return <LoadingText>Loading...</LoadingText> // ✅ 데이터 로딩 중 표시
   }

   return (
      <Wrapper>
         <TitleContainer>
            <Title>스터디 방장 위임</Title>
            <Divider />
         </TitleContainer>
         <MemberList>
            {members.map((member) => (
               <Label key={member}>
                  <input type="radio" name="leader" value={member} checked={selectedLeader === member} onChange={handleLeaderChange} />
                  {member}
               </Label>
            ))}
         </MemberList>

         <TransferButton onClick={handleTransfer}>스터디 방장 위임</TransferButton>
      </Wrapper>
   )
}

export default StudyLeaderTransfer

// ✅ Styled Components
const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   min-height: 100vh;
   padding: 40px;
`

const Title = styled.h2`
   font-size: 28px;
   font-weight: bold;
`

const TitleContainer = styled.div`
   width: 100%;
   max-width: 600px;
   display: flex;
   flex-direction: column;
   align-items: flex-start; /* 왼쪽 정렬 */
`

const Divider = styled.div`
   width: 100%;
   max-width: 600px;
   border-top: 3px solid #ff7a00;
   margin: 20px 0;
`

const MemberList = styled.div`
   display: flex;
   flex-direction: column;
   align-items: flex-start;
   gap: 60px;
   margin-bottom: 30px;
`

const Label = styled.label`
   font-size: 18px;
   display: flex;
   align-items: center;
   gap: 10px;
`

const TransferButton = styled.button`
   padding: 12px 24px;
   font-size: 18px;
   background-color: #ff7a00;
   color: white;
   border: none;
   border-radius: 5px;
   cursor: pointer;
   width: 30%;
   &:hover {
      background-color: #e66e00;
   }
`

const LoadingText = styled.p`
   font-size: 18px;
   color: gray;
`
