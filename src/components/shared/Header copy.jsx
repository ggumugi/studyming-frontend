import React, { useState } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, MenuItem } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { FaRegBell } from 'react-icons/fa'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { logoutUserThunk, checkAuthStatusThunk } from '../../features/authSlice'

const Header = ({ isAuthenticated, user }) => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

   useEffect(() => {
      dispatch(checkAuthStatusThunk()) // ✅ 새로고침 시 로그인 상태 확인
   }, [dispatch])

   // 로그아웃 버튼 클릭 시 실행
   // const handleLogout = () => {
   //    dispatch(logoutUserThunk())
   //       .unwrap()
   //       .then(() => {
   //          alert('로그아웃 되었습니다.')
   //          navigate('/login') // ✅ 로그인 페이지로 이동
   //       })
   //       .catch((error) => {
   //          alert(error || '로그아웃 실패')
   //       })
   // }

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

   // 📌 게시판 메뉴 열기/닫기
   const handleBoardClick = (event) => setBoardAnchor(event.currentTarget)
   const handleBoardClose = () => setBoardAnchor(null)

   // 📌 유저 메뉴 열기/닫기
   const handleUserClick = (event) => setUserAnchor(event.currentTarget)
   const handleUserClose = () => setUserAnchor(null)

   return (
      <HeaderContainer>
         <HeaderContent>
            {/* 📌 왼쪽 영역: 로고 + 네비게이션 메뉴 */}
            <LeftSection>
               <Link to="/">
                  <Logo src="/img/studyming-logo.png" alt="스터디밍 로고" />
               </Link>

               {/* 🔥 로그인한 사용자만 메뉴 표시 */}
               {isAuthenticated && (
                  <NavMenu>
                     <Link to="/study">
                        <NavItem>스터디</NavItem>
                     </Link>
                     <Link to="/mingshop">
                        <NavItem>밍샵</NavItem>
                     </Link>

                     {/* 📌 게시판 드롭다운 버튼 */}
                     <NavItem onClick={handleBoardClick} $isOpen={boardOpen}>
                        게시판 {boardOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                     </NavItem>

                     {/* 📌 게시판 드롭다운 메뉴 */}
                     <Menu anchorEl={boardAnchor} open={boardOpen} onClose={handleBoardClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
                        <CustomMenuItem onClick={handleBoardClose}>
                           <Link to="/board/general">자유</Link>
                        </CustomMenuItem>
                        <CustomMenuItem onClick={handleBoardClose}>
                           <Link to="/board/qna">질문</Link>
                        </CustomMenuItem>
                        <CustomMenuItem onClick={handleBoardClose}>
                           <Link to="/board/study">정보</Link>
                        </CustomMenuItem>
                        <CustomMenuItem onClick={handleBoardClose}>
                           <Link to="/board/inquiry">문의</Link>
                        </CustomMenuItem>
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
                     <NotificationIcon />

                     {/* 📌 유저 닉네임 + 로그아웃 버튼 추가 */}
                     <UserWrapper>
                        <UserMenu onClick={handleUserClick} $isOpen={userOpen}>
                           {user?.nickname} 님 {userOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </UserMenu>
                        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton> {/* ✅ 유저 닉네임 옆에 로그아웃 버튼 추가 */}
                     </UserWrapper>

                     {/* 📌 사용자 드롭다운 메뉴 */}
                     <Menu anchorEl={userAnchor} open={userOpen} onClose={handleUserClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                        <CustomMenuItem onClick={handleUserClose}>
                           <Link to="/profile">내 프로필</Link>
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
                           <span style={{ color: 'red' }}>회원 탈퇴</span> {/* ✅ 회원 탈퇴 메뉴 유지 */}
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
   margin-right: 100px;
`

const NavMenu = styled.ul`
   display: flex;
   gap: 80px;
`

const NavItem = styled.li`
   font-size: 20px;
   font-weight: 300;
   color: ${(props) => (props.$isOpen ? '#ff7f00' : '#000')};
   cursor: pointer;
   display: flex;
   align-items: center;
   gap: 5px;
   &:hover {
      color: #ff7f00;
   }
`

const RightSection = styled.div`
   display: flex;
   align-items: center;
   gap: 30px;
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
   gap: 5px;
   cursor: pointer;
   &:hover {
      color: #ff7f00;
   }
`

const CustomMenuItem = styled(MenuItem)`
   width: 150px;
   text-align: center;
   display: flex;
   justify-content: center;
   align-items: center; /* ✅ 세로 중앙 정렬 */
   flex-direction: column; /* ✅ 내부 요소 세로 배치 */

   & a {
      text-decoration: none;
      color: inherit;
      width: 100%;
      text-align: center;
      font-weight: 300;
      font-size: 16px;
   }

   &:hover {
      background-color: #fff5e1;
   }

   span {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.6);
      display: block;
      width: 100%;
      text-align: center;
   }
`
const UserWrapper = styled.div`
   display: flex;
   align-items: center;
   gap: 15px; /* 닉네임과 로그아웃 버튼 사이 간격 */
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
