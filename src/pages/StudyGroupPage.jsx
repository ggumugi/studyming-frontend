import React, { useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import GroupSidebar from '../components/sidebar/GroupSidebar'
import Chat from '../components/studyGroup/Chat'
import ScreenShare from '../components/studyGroup/ScreenShare'
import Cam from '../components/studyGroup/Cam'
import Timer from '../components/shared/Timer'

// Mock 데이터
const mockStudyGroups = {
   123: { name: 'React 스터디', members: 5 },
   456: { name: 'Node.js 스터디', members: 8 },
}

const StudyGroupPage = () => {
   const { id } = useParams()
   const studyGroup = mockStudyGroups[id]

   // 🔥 사이드바에서 선택한 메뉴 상태
   const [selectedMenu, setSelectedMenu] = useState('채팅')

   // 🔥 선택한 메뉴에 따라 렌더링할 컴포넌트 매핑
   const renderComponent = () => {
      switch (selectedMenu) {
         case '채팅':
            return <Chat />
         case '화면공유':
            return <ScreenShare />
         case '카메라':
            return <Cam />
         default:
            return <p>잘못된 메뉴 선택</p>
      }
   }

   return (
      <Container>
         {/* ✅ 왼쪽 사이드바 */}
         <GroupSidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

         {/* ✅ 메인 콘텐츠 영역 */}
         <ContentArea>
            {/* 🔥 스터디 그룹 이름이 h1에 자동 반영됨 */}
            <h1>{studyGroup ? studyGroup.name : '존재하지 않는 스터디 그룹'}</h1>

            {studyGroup ? (
               /* 🔥 선택한 메뉴에 따라 동적으로 컴포넌트 렌더링 */
               renderComponent()
            ) : (
               <p>존재하지 않는 스터디 그룹입니다.</p>
            )}
         </ContentArea>
         <Timer />
      </Container>
   )
}

export default StudyGroupPage

// ⭐ Styled Components
const Container = styled.div`
   display: flex;
   height: 100%;
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
