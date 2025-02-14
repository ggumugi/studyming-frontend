import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Menu, MenuItem } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { FaRegBell } from 'react-icons/fa'

const Header = () => {
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
            <LeftSection>
               <Link to="/">
                  <Logo src="/img/studyming-logo.png" alt="스터디밍 로고" />
               </Link>
               <NavMenu>
                  <Link to="/study">
                     <NavItem>스터디</NavItem>
                  </Link>
                  <Link to="/shop">
                     <NavItem>밍샵</NavItem>
                  </Link>

                  {/* 📌 게시판 드롭다운 버튼 */}
                  <NavItem onClick={handleBoardClick} $isOpen={boardOpen}>
                     게시판 {boardOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </NavItem>

                  {/* 📌 게시판 드롭다운 메뉴 */}
                  <Menu anchorEl={boardAnchor} open={boardOpen} onClose={handleBoardClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
                     <CustomMenuItem onClick={handleBoardClose}>
                        <Link to="/board/general">
                           자유
                           <br /> <span>유저간의 자유로운 소통</span>
                        </Link>
                     </CustomMenuItem>
                     <CustomMenuItem onClick={handleBoardClose}>
                        <Link to="/board/qna">
                           질문
                           <br /> <span>유저간의 Q & A</span>
                        </Link>
                     </CustomMenuItem>
                     <CustomMenuItem onClick={handleBoardClose}>
                        <Link to="/board/study">
                           정보
                           <br /> <span>시험 정보 안내</span>
                        </Link>
                     </CustomMenuItem>
                     <CustomMenuItem onClick={handleBoardClose}>
                        <Link to="/board/inquiry">
                           문의
                           <br /> <span>관리자와 Q & A</span>
                        </Link>
                     </CustomMenuItem>
                  </Menu>

                  <Link to="/admin">
                     <NavItem>관리</NavItem>
                  </Link>
               </NavMenu>
            </LeftSection>
            <RightSection>
               <NotificationIcon />

               {/* 📌 사용자 드롭다운 버튼 */}
               <UserMenu onClick={handleUserClick} $isOpen={userOpen}>
                  Lee 님 {userOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
               </UserMenu>

               {/* 📌 사용자 드롭다운 메뉴 */}
               <Menu anchorEl={userAnchor} open={userOpen} onClose={handleUserClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                  <CustomMenuItem onClick={handleUserClose}>
                     <span style={{ color: '#ff7f00' }}>0 밍</span>
                  </CustomMenuItem>
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
                     <span style={{ color: 'red' }}>회원 탈퇴</span>
                  </CustomMenuItem>
               </Menu>
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
   & a {
      text-decoration: none;
      color: inherit;
      width: 100%;
      text-align: center;
   }
   &:hover {
      background-color: #fff5e1;
   }
   span {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
   }
`
