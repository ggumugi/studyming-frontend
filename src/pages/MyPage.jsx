// src/pages/MyPage.jsx
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import MyProfile from '../components/myPage/MyProfile'
import MyInfo from '../components/myPage/MyInfo'
import MyItem from '../components/myPage/MyItem'
import MyPay from '../components/myPage/MyPay'
import AccountDelete from '../components/myPage/AccountDelete'
import MyPageSidebar from '../components/sidebar/MyPageSidebar'
import PasswordAuthModal from '../components/myPage/PasswordAuthModal'

function MyPage({ isAuthenticated, user }) {
   const [selectedMenu, setSelectedMenu] = useState('내 정보') // 기본 선택된 메뉴
   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
   const [isAuthenticatedPass, setIsAuthenticatedPass] = useState(false)
   const location = useLocation()

   // 페이지 로드 시 또는 URL이 변경될 때마다 인증 상태 초기화
   useEffect(() => {
      if (location.pathname === '/mypage') {
         setIsAuthenticatedPass(false)

         // 내 정보 메뉴가 선택된 경우에만 모달 표시
         if (selectedMenu === '내 정보') {
            setIsAuthModalOpen(true)
         }
      }
   }, [location.pathname])

   // 메뉴 변경 핸들러
   const handleMenuChange = (menu) => {
      setSelectedMenu(menu)

      // 내 정보 메뉴로 변경하고 아직 인증되지 않았으면 모달 표시
      if (menu === '내 정보' && !isAuthenticatedPass) {
         setIsAuthModalOpen(true)
      }
   }

   // 인증 성공 핸들러
   const handleAuthSuccess = () => {
      setIsAuthenticatedPass(true)
      setIsAuthModalOpen(false)
   }

   return (
      <Container>
         <MyPageSidebar selectedMenu={selectedMenu} setSelectedMenu={handleMenuChange} />

         {/* 오른쪽 콘텐츠 영역 */}
         <ContentArea>
            <h2>{selectedMenu}</h2>
            {selectedMenu === '내 정보' && (isAuthenticatedPass ? <MyInfo user={user} /> : <AuthPlaceholder>비밀번호 인증이 필요합니다.</AuthPlaceholder>)}
            {selectedMenu === '내 아이템' && <MyItem />}
            {selectedMenu === '결제 및 밍 내역' && <MyPay />}
            {selectedMenu === '회원 탈퇴' && <AccountDelete />}
         </ContentArea>

         {/* 비밀번호 인증 모달 */}
         <PasswordAuthModal
            isOpen={isAuthModalOpen}
            onClose={() => {
               setIsAuthModalOpen(false)
               // 인증 취소 시 다른 메뉴로 전환 (선택 사항)
               if (!isAuthenticatedPass && selectedMenu === '내 정보') {
                  setSelectedMenu('내 아이템')
               }
            }}
            onSuccess={handleAuthSuccess}
         />
      </Container>
   )
}

export default MyPage

// Styled Components
const Container = styled.div`
   display: flex;
   height: 100%;
`

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

const AuthPlaceholder = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 300px;
   font-size: 18px;
   color: #888;
   background-color: #f9f9f9;
   border-radius: 8px;
   margin-top: 30px;
`
