import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

/* 각 페이지 불러오기 (테스트로 채팅만 불러봄봄) */
import ChatPage from './ChatPage'

const Sidebar = () => {
   const [selectedMenu, setSelectedMenu] = useState('화면공유') // 기본 선택된 메뉴

   // 🔥 메뉴에 따른 더미 데이터 설정
   const menuContent = {
      채팅: <ChatPage />,
      화면공유: '화면공유 관련 내용이 표시됩니다.',
      카메라: '카메라 관련 내용이 표시됩니다.',
   }

   return (
      <Container>
         <SidebarContainer>
            <MenuList>
               {['채팅', '화면공유', '카메라'].map((item) => (
                  <MenuItem key={item} isActive={selectedMenu === item} onClick={() => setSelectedMenu(item)}>
                     <StyledLink to={`/${item}`}>{item}</StyledLink>
                     {selectedMenu === item && <ActiveIndicator />} {/* ✅ 활성화된 메뉴에 동그라미 표시 */}
                  </MenuItem>
               ))}
            </MenuList>
         </SidebarContainer>

         {/* 🔥 오른쪽 콘텐츠 영역 */}
         <ContentArea>
            <h2>{selectedMenu}</h2>
            <p>{menuContent[selectedMenu]}</p> {/* ✅ 선택한 메뉴에 맞는 더미 데이터 표시 */}
         </ContentArea>
      </Container>
   )
}

export default Sidebar

// ⭐ Styled Components
const Container = styled.div`
   display: flex;
   height: 100vh;
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
   gap: 70px; /* ✅ 메뉴 간 간격 */
`

const MenuItem = styled.li`
   position: relative;
   display: flex;
   align-items: center;
   justify-content: center;
   font-size: 20px;
   font-weight: ${(props) => (props.isActive ? '500' : '300')};
   color: ${(props) => (props.isActive ? '#FF7A00' : '#000')};
   cursor: pointer;
`

const StyledLink = styled(Link)`
   text-decoration: none;
   color: inherit;
   &:hover {
      color: #ff7f00;
   }
`

// 🔥 활성화된 메뉴 오른쪽에 동그라미 표시
const ActiveIndicator = styled.div`
   position: absolute;
   right: -24px; /* ✅ 오른쪽에 동그라미 위치 */
   width: 8px;
   height: 8px;
   background-color: #ff7f00;
   border-radius: 50%;
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
