import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import ActionsTakenBoard from '../page/ActionsTakenBoard'
import BanRecordsBoard from '../page/BanRecordsBoard'
import ReportsBoard from '../page/ReportsBoard'
import { Paper, Typography, Button, TextField, Box } from '@mui/material'
import { useEffect } from 'react'
import MemberRecordsBoard from '../page/MemberRecordsBoard'

import CreateBoard from '../page/CreateBoard'

/* 각 페이지 불러오기 (테스트로 채팅만 불러봄봄) */
// import ChatPage from './ChatPage'

const AdminBoardSidebar = ({ isAuthenticated, user }) => {
   const [isWriting, setIsWriting] = useState(false)
   const [selectedMenu, setSelectedMenu] = useState('회원정보') // 기본 선택된 메뉴

   // 🔥 메뉴에 따른 더미 데이터 설정

   const boardContent = {
      회원정보: <MemberRecordsBoard category="회원정보" />, // 회원내역 게시판
      신고내역: <ReportsBoard category="신고내역" isAuthenticated={isAuthenticated} user={user} />, // 신고내역 게시판
      처리내역: <ActionsTakenBoard v="처리내역" isAuthenticated={isAuthenticated} user={user} />, // 처리내역 게시판
      정지내역: <BanRecordsBoard category="정지내역" isAuthenticated={isAuthenticated} user={user} />, // 정지내역 게시판
   }

   return (
      <Container>
         <SidebarContainer>
            <MenuList>
               {['회원정보', '신고내역', '처리내역', '정지내역'].map((item) => (
                  <MenuItem key={item} $isActive={selectedMenu === item} onClick={() => setSelectedMenu(item)}>
                     <StyledButton to={`/${item}`}>{item}</StyledButton>
                     {selectedMenu === item && <ActiveIndicator />} {/* ✅ 활성화된 메뉴에 동그라미 표시 */}
                  </MenuItem>
               ))}
            </MenuList>
         </SidebarContainer>

         {/* 🔥 오른쪽 콘텐츠 영역 */}
         <ContentArea>
            {/* ✅ 기존 게시판 유지 */}
            <h2 style={{ fontSize: 'clamp(14px, 2vw, 20px)' }}>{selectedMenu} 게시판</h2>

            {boardContent[selectedMenu]}
         </ContentArea>
      </Container>
   )
}

export default AdminBoardSidebar

// ⭐ Styled Components
const Container = styled.div`
   display: flex;
   height: 100%;
   margin-bottom: 50px;

   @media (max-width: 1095px) {
      flex-direction: column;
   }
`

const SidebarContainer = styled.nav`
   width: clamp(100px, 10vw, 200px);
   margin-left: 20px;
   height: 100vh;
   padding: 20px;
   display: flex;
   flex-direction: column;
   border-right: 1px solid #ddd;

   @media (max-width: 1095px) {
      width: 100%;
      height: auto;
      flex-direction: row;
      border-right: none;
      border-bottom: 2px solid #ddd;
      justify-content: center;
      align-items: center;
      padding: 10px 0;
      margin-left: 0px;
   }
`

const MenuList = styled.ul`
   margin-top: 120px;
   list-style: none;
   padding: 0;
   display: flex;
   flex-direction: column;
   align-items: flex-end;
   gap: 70px;

   @media (max-width: 1095px) {
      flex-direction: row;
      margin-top: 10px;
      gap: clamp(50px, 15vw, 200px);
   }
`

const MenuItem = styled.li`
   flex-direction: column;
   position: relative;
   display: flex;
   margin-right: 20px;
   justify-content: center;
   font-size: clamp(14px, 1vw, 20px);
   font-weight: ${(props) => (props.$isActive ? '500' : '300')};
   color: ${(props) => (props.$isActive ? '#FF7A00' : '#000')};
   cursor: pointer;

   @media (max-width: 1095px) {
      margin-right: 0;
   }
`

const ActiveIndicator = styled.div`
   position: absolute;
   right: -44px;
   width: 8px;
   height: 8px;
   background-color: #ff7f00;
   border-radius: 50%;

   @media (max-width: 1095px) {
      right: auto;
      top: 135%;
      left: 50%;
      transform: translateX(-50%);
   }
`

const StyledButton = styled.button`
   all: unset;
   text-decoration: none;
   color: inherit;
   text-align: right;
   display: block;
   &:hover {
      color: #ff7f00;
   }
`

const SubText = styled.span`
   font-size: 12px;
   color: #888;
   margin-top: 4px;
   width: 100%;
`

// 🔥 오른쪽 콘텐츠 영역 스타일
const ContentArea = styled.div`
   flex: 1;
   padding: 70px 70px 0 70px;
   background-color: #fff;

   h2 {
      font-weight: 300;
      font-size: 32px;
      border-bottom: 2px solid #ff7a00;
      padding-bottom: 10px;
      margin-bottom: 20px;
   }
`
