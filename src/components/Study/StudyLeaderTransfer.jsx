import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { transferGroupLeaderThunk } from '../../features/groupmemberSlice'

import styled from 'styled-components'

const StudyLeaderTransfer = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const { id } = useParams() // URL에서 스터디 그룹 ID 추출
   const { groupmembers } = useSelector((state) => state.groupmembers.groupmember) // Redux 상태 가져오기
   const [selectedLeader, setSelectedLeader] = useState(null)

   const filteredMembers = groupmembers.filter((member) => member.role !== 'leader') // ✅ 방장 제외

   const handleLeaderChange = (e) => {
      setSelectedLeader(Number(e.target.value)) // 🔥 숫자로 변환하여 저장
   }

   const handleTransfer = () => {
      if (!selectedLeader) {
         alert('위임할 방장을 선택하세요.')
         return
      }
      const selectedLeaderNickname = groupmembers.find((member) => member.User.id === selectedLeader)?.User.nickname || '선택된 사용자'

      if (!window.confirm(`${selectedLeaderNickname}님에게 방장을 위임하시겠습니까?`)) return

      dispatch(transferGroupLeaderThunk({ groupId: id, newLeaderId: selectedLeader }))
         .unwrap()
         .then(() => {
            navigate(`/study/list`)
         })
         .catch((err) => {
            console.error('방장 위임 실패:', err)
            alert('방장 위임에 실패했습니다.')
         })
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
                     <input type="radio" name="leader" value={member.User.id} checked={selectedLeader === member.User.id} onChange={handleLeaderChange} />
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
