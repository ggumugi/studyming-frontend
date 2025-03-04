import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import MyProfile from '../components/myPage/MyProfile'
import MyInfo from '../components/myPage/MyInfo'
import MyItem from '../components/myPage/MyItem'
import MyPay from '../components/myPage/MyPay'
import AccountDelete from '../components/myPage/AccountDelete'
import MyPageSidebar from '../components/sidebar/MyPageSidebar'

function MyPage({ isAuthenticated, user }) {
   const [selectedMenu, setSelectedMenu] = useState('내 정보') // 기본 선택된 메뉴
   const menuList = ['내 정보', '내 아이템', '결제 및 밍 내역', '회원 탈퇴']
   return (
      <Container>
         <MyPageSidebar selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />

         {/* 🔥 오른쪽 콘텐츠 영역 */}
         <ContentArea>
            <h2>{selectedMenu}</h2>
            {selectedMenu === '내 정보' && <MyInfo isAuthenticated={isAuthenticated} user={user} />}
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
