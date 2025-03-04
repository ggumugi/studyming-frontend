import React, { useState } from 'react'
import styled from 'styled-components'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, MenuItem } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { FaRegBell } from 'react-icons/fa'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { logoutUserThunk, checkAuthStatusThunk } from '../../features/authSlice'
import { setCategory } from '../../features/postSlice' // ✅ Redux 액션 추가

const Header = ({ isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const location = useLocation()

   const handleLogout = useCallback(() => {
      dispatch(logoutUserThunk())
         .unwrap()
         .then(() => {
            window.location.href = '/' // ✅ 로그아웃 후 강제 새로고침
         })
         .catch((error) => {
            alert(`로그아웃 실패: ${error}`)
         })
   }, [dispatch])

   // 📌 게시판 드롭다운 상태
   const [boardAnchor, setBoardAnchor] = useState(null)
   const boardOpen = Boolean(boardAnchor)

   // 📌 유저 드롭다운 상태
   const [userAnchor, setUserAnchor] = useState(null)
   const userOpen = Boolean(userAnchor)

   // 📌 게시판 카테고리 매핑
   const categoryMap = {
      자유: 'free',
      질문: 'QnA',
      정보: 'noti',
      문의: 'inquiry',
   }

   // 📌 게시판 버튼 클릭 시 드롭다운 열기
   const handleBoardClick = (event) => {
      setBoardAnchor(event.currentTarget)
   }

   // 📌 게시판 카테고리 클릭 시 Redux 상태 업데이트 (URL 변경 X)
   const handleBoardCategoryClick = (category) => {
      dispatch(setCategory(categoryMap[category])) // ✅ Redux 상태 업데이트

      if (location.pathname !== '/board') {
         navigate('/board') // ✅ 다른 페이지에서는 먼저 `/board`로 이동
      }

      setBoardAnchor(null) // ✅ 드롭다운 닫기
   }

   // 📌 유저 메뉴 열기/닫기
   const handleUserClick = (event) => setUserAnchor(event.currentTarget)
   const handleUserClose = () => setUserAnchor(null)

   return (
      <HeaderContainer>
         <HeaderContent>
            {/* 📌 왼쪽 영역: 로고 + 네비게이션 메뉴 */}
            <LeftSection>
               <Link to={isAuthenticated ? '/home' : '/'}>
                  <Logo src="/img/studyming-logo.png" alt="스터디밍 로고" />
               </Link>

               {/* 🔥 로그인한 사용자만 메뉴 표시 */}
               {isAuthenticated && (
                  <NavMenu>
                     <Link to="/study/list">
                        <NavItem>스터디</NavItem>
                     </Link>
                     <Link to="/mingshop">
                        <NavItem>밍샵</NavItem>
                     </Link>

                     {/* 📌 게시판 드롭다운 버튼 */}
                     <NavItem onClick={handleBoardClick} $isOpen={boardOpen}>
                        게시판 {boardOpen ? <KeyboardArrowUpIcon style={{ fontSize: ' clamp(14px, 2vw, 20px)' }} /> : <KeyboardArrowDownIcon style={{ fontSize: ' clamp(14px, 2vw, 20px)' }} />}
                     </NavItem>

                     {/* 📌 게시판 드롭다운 메뉴 */}
                     <Menu anchorEl={boardAnchor} open={boardOpen} onClose={() => setBoardAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
                        {Object.keys(categoryMap).map((item) => (
                           <CustomMenuItem key={item} onClick={() => handleBoardCategoryClick(item)} style={{ padding: '10px 25px' }}>
                              {item}
                           </CustomMenuItem>
                        ))}
                     </Menu>

                     {/* 🔥 관리자만 "관리" 메뉴 표시 */}
                     {user?.role === 'ADMIN' && (
                        <Link to="/admin">
                           <NavItem>관리</NavItem>
                        </Link>
                     )}
                  </NavMenu>
               )}
            </LeftSection>

            {/* 📌 오른쪽 영역: 알림 아이콘 + 유저 메뉴 + 로그아웃 버튼 */}
            <RightSection>
               {isAuthenticated ? (
                  <>
                     <NotificationIcon style={{ fontSize: ' clamp(14px, 2vw, 20px)' }} />

                     {/* 📌 유저 닉네임 + 로그아웃 버튼 추가 */}
                     <UserWrapper>
                        <UserMenu onClick={handleUserClick} $isOpen={userOpen} style={{ fontSize: ' clamp(14px, 1vw, 20px)' }}>
                           {user?.nickname} 님 {userOpen ? <KeyboardArrowUpIcon style={{ fontSize: ' clamp(14px, 2vw, 20px)' }} /> : <KeyboardArrowDownIcon style={{ fontSize: ' clamp(14px, 2vw, 20px)' }} />}
                        </UserMenu>
                        <LogoutButton onClick={handleLogout} style={{ fontSize: ' clamp(14px, 1vw, 20px)' }}>
                           로그아웃
                        </LogoutButton>
                     </UserWrapper>

                     {/* 📌 사용자 드롭다운 메뉴 */}
                     <Menu anchorEl={userAnchor} open={userOpen} onClose={handleUserClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                        <CustomMenuItem onClick={handleUserClose}>
                           <Link to="/mypage">내 프로필</Link>
                        </CustomMenuItem>
                        <CustomMenuItem onClick={handleUserClose}>
                           <Link to="/info">내 정보</Link>
                        </CustomMenuItem>
                        <CustomMenuItem onClick={handleUserClose}>
                           <Link to="/items">내 아이템</Link>
                        </CustomMenuItem>
                        <CustomMenuItem onClick={handleUserClose}>
                           <Link to="/payment">결제 및 밍 내역</Link>
                        </CustomMenuItem>
                        <CustomMenuItem onClick={handleUserClose}>
                           <span style={{ color: 'red' }}>회원 탈퇴</span>
                        </CustomMenuItem>
                     </Menu>
                  </>
               ) : (
                  <Link to="/login">
                     <NavItem>로그인</NavItem>
                  </Link>
               )}
            </RightSection>
         </HeaderContent>
      </HeaderContainer>
   )
}

export default Header

// 🎨 Styled Components
const HeaderContainer = styled.header`
   width: 100%;
   height: 60px;
   background-color: #f8f8f8;
   display: flex;
   align-items: center;
   justify-content: center;
   border-bottom: 1px solid #ddd;
`

const HeaderContent = styled.div`
   width: 90%;
   display: flex;
   justify-content: space-between;
   align-items: center;
`

const LeftSection = styled.div`
   display: flex;
   align-items: center;
`

const Logo = styled.img`
   height: 25px;
   margin-right: clamp(20px, 4vw, 100px);
`

const NavMenu = styled.ul`
   display: flex;
   gap: clamp(20px, 4vw, 80px);
   align-items: center;
`

const NavItem = styled.li`
   font-size: clamp(14px, 1vw, 20px);
   font-weight: 300;
   color: ${(props) => (props.$isOpen ? '#ff7f00' : '#000')};
   cursor: pointer;
   display: flex;
   align-items: center;
   gap: 3px;
   &:hover {
      color: #ff7f00;
   }
`

const RightSection = styled.div`
   display: flex;
   align-items: center;
   gap: clamp(10px, 2vw, 50px);
`

const NotificationIcon = styled(FaRegBell)`
   font-size: 22px;
   color: #ff7f00;
   cursor: pointer;
   &:hover {
      color: #e66a00;
   }
`

const UserMenu = styled.div`
   font-size: 16px;
   font-weight: 600;
   color: ${(props) => (props.$isOpen ? '#ff7f00' : '#000')};
   display: flex;
   align-items: center;
   cursor: pointer;

   &:hover {
      color: #ff7f00;
   }
`

const CustomMenuItem = styled(MenuItem)`
   text-align: center;

   & a {
      text-decoration: none;
      color: inherit;
      width: 100%;
      text-align: center;
   }
`

const UserWrapper = styled.div`
   display: flex;
   align-items: center;
   gap: clamp(10px, 2vw, 50px);
`

const LogoutButton = styled.button`
   background: none;
   border: none;
   font-size: 16px;
   color: red;
   cursor: pointer;
   &:hover {
      text-decoration: underline;
   }
`
