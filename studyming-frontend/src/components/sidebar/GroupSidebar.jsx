import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import TeamList from '../studyGroup/TeamList' // ✅ 팀원 목록 추가

const GroupSidebar = () => {
   const [selectedMenu, setSelectedMenu] = useState('채팅')

   return (
      <SidebarContainer>
         <MenuList>
            {['채팅', '화면공유', '카메라'].map((item) => (
               <MenuItem key={item} isActive={selectedMenu === item} onClick={() => setSelectedMenu(item)}>
                  <StyledButton to={`/${item}`}>{item}</StyledButton>
                  {selectedMenu === item && <ActiveIndicator />} {/* ✅ 활성화된 메뉴에 동그라미 표시 */}
               </MenuItem>
            ))}
         </MenuList>

         {/* ✅ 기존 메뉴 아래에 TeamList 배치 */}
         <TeamListWrapper>
            <TeamList />
         </TeamListWrapper>
      </SidebarContainer>
   )
}

export default GroupSidebar

// ⭐ Styled Components
const SidebarContainer = styled.nav`
   width: 250px;
   height: 100vh;
   padding: 20px;
   display: flex;
   flex-direction: column; /* ✅ 아래쪽으로 정렬 */
   border-right: 1px solid #ddd;
   justify-content: space-between; /* ✅ 상단 메뉴 & 하단 팀원 목록 */
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
   font-weight: ${(props) => (props.isActive ? '500' : '300')};
   color: ${(props) => (props.isActive ? '#FF7A00' : '#000')};
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
   margin-top: auto; /* ✅ 사이드바 하단에 배치 */
   width: 100%;
`
