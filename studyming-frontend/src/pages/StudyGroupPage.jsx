import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import GroupSidebar from '../components/sidebar/GroupSidebar'

// Mock 데이터
const mockStudyGroups = {
   123: { name: 'React 스터디', members: 5 },
   456: { name: 'Node.js 스터디', members: 8 },
}

const StudyGroupPage = () => {
   const { id } = useParams()
   const studyGroup = mockStudyGroups[id]

   return (
      <Container>
         {/* ✅ 왼쪽 사이드바 (GroupSidebar + TeamList 포함) */}
         <GroupSidebar />

         {/* ✅ 메인 콘텐츠 영역 */}
         <ContentArea>
            <h1>스터디 그룹 페이지</h1>
            {studyGroup ? (
               <div>
                  <p>그룹 이름: {studyGroup.name}</p>
                  <p>멤버 수: {studyGroup.members}명</p>
               </div>
            ) : (
               <p>존재하지 않는 스터디 그룹입니다.</p>
            )}
         </ContentArea>
      </Container>
   )
}

export default StudyGroupPage

// ⭐ Styled Components
const Container = styled.div`
   display: flex;
   height: 100vh;
`

const ContentArea = styled.div`
   flex: 1;
   padding: 40px;
   background-color: #fff;

   h1 {
      font-size: 28px;
      font-weight: 300;
      border-bottom: 2px solid #ff7a00;
      padding-bottom: 10px;
      margin-bottom: 20px;
   }
`
