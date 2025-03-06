import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import TeamList from '../studyGroup/TeamList' // ✅ 팀원 목록 추가

const GroupSidebar = ({ selectedMenu, setSelectedMenu, isAuthenticated, user, studygroup, groupmembers }) => {
   return (
      <SidebarContainer>
         <MenuList>
            {['채팅', '공부방'].map((item) => (
               <MenuItem key={item} $isActive={selectedMenu === item}>
                  {/* ✅ `onClick`을 StyledButton이 아니라 `MenuItem`에 추가해야 제대로 동작함! */}
                  <StyledButton onClick={() => setSelectedMenu(item)}>{item}</StyledButton>
                  {selectedMenu === item && <ActiveIndicator />}
               </MenuItem>
            ))}
         </MenuList>

         {/* ✅ 기존 메뉴 아래에 TeamList 배치 */}
         <TeamListWrapper>
            <TeamList groupmembers={groupmembers} />
         </TeamListWrapper>
      </SidebarContainer>
   )
}

export default GroupSidebar

// ⭐ Styled Components
const SidebarContainer = styled.nav`
   width: clamp(100px, 10vw, 200px);
   height: 180vh;
   padding: 20px;
   display: flex;
   flex-direction: column; /* ✅ 아래쪽으로 정렬 */
   border-right: 1px solid #ddd;
   gap: 200px;
`

const MenuList = styled.ul`
   margin-top: 100px;
   list-style: none;
   padding: 0;
   display: flex;
   flex-direction: column;
   align-items: flex-end;
   gap: 40px; /* ✅ 메뉴 간 간격 */
`

const MenuItem = styled.li`
   position: relative;
   display: flex;
   margin-right: 10px;
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

const ActiveIndicator = styled.div`
   position: absolute;
   right: -34px;
   top: 50%; /* ✅ 부모 요소(MenuItem)의 정중앙으로 정렬 */
   transform: translateY(-50%); /* ✅ 위아래 정렬을 정확히 맞춤 */
   width: 8px;
   height: 8px;
   background-color: #ff7f00;
   border-radius: 50%;
`

const TeamListWrapper = styled.div`
   width: 100%;
`
