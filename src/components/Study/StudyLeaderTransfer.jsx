import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'

const StudyLeaderTransfer = ({ user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams() // URL에서 스터디 그룹 ID 추출
   const { groupmembers } = useSelector((state) => state.groupmembers.groupmember) // Redux 상태 가져오기
   const [selectedLeader, setSelectedLeader] = useState('')

   useEffect(() => {
      console.log('Redux에서 가져온 groupmembers:', groupmembers) // ✅ 데이터 확인
   }, [groupmembers])

   const filteredMembers = groupmembers.filter((member) => member.role !== 'leader') // ✅ 방장 제외
   console.log('filteredMembers', filteredMembers)
   const handleLeaderChange = (e) => {
      setSelectedLeader(e.target.value)
   }

   const handleTransfer = () => {
      if (!selectedLeader) {
         alert('위임할 방장을 선택하세요.')
         return
      }
      alert(`${selectedLeader}님에게 방장을 위임합니다.`)
      // TODO: 방장 위임 API 연결 후 처리
      navigate(`/study/list`) // ✅ 위임 후 스터디 상세 페이지로 이동
   }

   // if (loading) {
   //    return <LoadingText>Loading...</LoadingText> // ✅ 로딩 중 표시
   // }
   return (
      <Wrapper>
         <TitleContainer>
            <Title>스터디 방장 위임</Title>
            <Divider />
         </TitleContainer>
         <MemberList>
            {filteredMembers.length > 0 ? (
               filteredMembers.map((member) => (
                  <Label key={member.userId}>
                     <input type="radio" name="leader" value={member.userId} checked={selectedLeader === member.userId} onChange={handleLeaderChange} />
                     {member.User.nickname}
                  </Label>
               ))
            ) : (
               <p>위임할 멤버가 없습니다.</p>
            )}
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
