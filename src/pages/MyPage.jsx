import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import MyProfile from '../components/myPage/MyProfile'
import MyInfo from '../components/myPage/MyInfo'
import MyItem from '../components/myPage/MyItem'
import MyPay from '../components/myPage/MyPay'
import AccountDelete from '../components/myPage/AccountDelete'

function MyPage() {
   const [selectedMenu, setSelectedMenu] = useState('내 프로필') // 기본 선택된 메뉴
   const menuList = ['내 프로필', '내 정보', '내 아이템', '결제 및 밍 내역', '회원 탈퇴']
   return (
      <Container>
         <SidebarContainer>
            <MenuList>
               {menuList.map((item) => (
                  <MenuItem key={item} $isActive={selectedMenu === item} onClick={() => setSelectedMenu(item)}>
                     <StyledButton to={`/${item}`}>{item}</StyledButton>
                     {selectedMenu === item && <ActiveIndicator />} {/* ✅ 활성화된 메뉴에 동그라미 표시 */}
                  </MenuItem>
               ))}
            </MenuList>
         </SidebarContainer>

         {/* 🔥 오른쪽 콘텐츠 영역 */}
         <ContentArea>
            <h2>{selectedMenu}</h2>
            {selectedMenu === '내 프로필' && <MyProfile />} {/* ✅ '내 프로필' 메뉴일 경우 MyProfile 컴포넌트로 */}
            {selectedMenu === '내 정보' && <MyInfo />}
            {selectedMenu === '내 아이템' && <MyItem />}
            {selectedMenu === '결제 및 밍 내역' && <MyPay />}
            {selectedMenu === '회원 탈퇴' && <AccountDelete />}
         </ContentArea>
      </Container>
   )
}

export default MyPage

// ⭐ Styled Components
const Container = styled.div`
   display: flex;
   height: 100%;
`

const SidebarContainer = styled.nav`
   width: 300px;
   height: 120vh;
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
   gap: 70px; /* :흰색_확인_표시: 메뉴 간 간격 */
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
