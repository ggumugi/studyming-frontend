import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import FreeBoard from '../page/FreeBoard'
import InquiryBoard from '../page/InquiryBoard'
import NotiBoard from '../page/NotiBoard'
import QaBoard from '../page/QaBoard'
import { Paper, Typography, Button, TextField, Box } from '@mui/material'
import { useEffect } from 'react'

import CreateBoard from '../page/CreateBoard'

/* 각 페이지 불러오기 (테스트로 채팅만 불러봄봄) */
// import ChatPage from './ChatPage'

const BoardSidebar = ({ selectedCategory, setSelectedCategory }) => {
   const categories = ['자유', '질문', '정보', '문의']

   return (
      <Container>
         <SidebarContainer>
            <MenuList>
               {categories.map((item) => (
                  <MenuItem key={item} $isActive={selectedCategory === item} onClick={() => setSelectedCategory(item)}>
                     <StyledButton>{item}</StyledButton>
                     {selectedCategory === item && <ActiveIndicator />}
                  </MenuItem>
               ))}
            </MenuList>
         </SidebarContainer>
      </Container>
   )
}

export default BoardSidebar

// ⭐ Styled Components
const Container = styled.div`
   display: flex;
   height: 100%;
   margin-bottom: 50px;
`

const SidebarContainer = styled.nav`
   width: 200px;
   height: 100vh;
   padding: 20px;
   display: flex;
   flex-direction: column;
   border-right: 1px solid #ddd;
`

const MenuList = styled.ul`
   margin-top: 170px;
   list-style: none;
   padding: 0;
   display: flex;
   flex-direction: column;
   align-items: flex-end;
   gap: 70px; /* ✅ 메뉴 간 간격 */
`

const MenuItem = styled.li`
   flex-direction: column;
   position: relative;
   display: flex;
   margin-right: 20px;
   justify-content: center;
   font-size: 20px;
   font-weight: ${(props) => (props.$isActive ? '500' : '300')};
   color: ${(props) => (props.$isActive ? '#FF7A00' : '#000')};
   cursor: pointer;
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
/* 
const SubText = styled.span`
   font-size: 12px;
   color: #888;
   margin-top: 4px;
   width: 100%;
`
 */
// 🔥 활성화된 메뉴 오른쪽에 동그라미 표시
const ActiveIndicator = styled.div`
   position: absolute;
   right: -44px; /* ✅ 오른쪽에 동그라미 위치 */
   width: 8px;
   height: 8px;
   background-color: #ff7f00;
   border-radius: 50%;
`

// 🔥 오른쪽 콘텐츠 영역 스타일
/* const ContentArea = styled.div`
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
 */
