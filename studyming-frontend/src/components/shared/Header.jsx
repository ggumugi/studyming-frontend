import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Menu, MenuItem } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
const Header = () => {
   const [anchorEl, setAnchorEl] = useState(null)
   const open = Boolean(anchorEl)
   // 드롭다운 메뉴 열기
   const handleClick = (event) => {
      setAnchorEl(event.currentTarget)
   }
   // 드롭다운 메뉴 닫기
   const handleClose = () => {
      setAnchorEl(null)
   }
   return (
      <HeaderContainer>
         <HeaderContent>
            <LeftSection>
               <Link to="/">
                  <Logo src="img/studyming-logo.png" alt="스터디밍 로고" />
               </Link>
               <NavMenu>
                  <Link to="/study">
                     <NavItem>스터디</NavItem>
                  </Link>
                  <Link to="/shop">
                     <NavItem>밍샵</NavItem>
                  </Link>
                  {/* :불: MUI 드롭다운이 적용된 "게시판 ▼" */}
                  <NavItem onClick={handleClick}>
                     게시판 <KeyboardArrowDownIcon />
                  </NavItem>
                  {/* MUI 드롭다운 메뉴 */}
                  <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} transformOrigin={{ vertical: 'top', horizontal: 'left' }}>
                     <MenuItem onClick={handleClose}>
                        <Link to="/board/general" style={{ textDecoration: 'none', color: 'inherit' }}>
                           자유 게시판
                        </Link>
                     </MenuItem>
                     <MenuItem onClick={handleClose}>
                        <Link to="/board/study" style={{ textDecoration: 'none', color: 'inherit' }}>
                           정보 게시판
                        </Link>
                     </MenuItem>
                     <MenuItem onClick={handleClose}>
                        <Link to="/board/qna" style={{ textDecoration: 'none', color: 'inherit' }}>
                           질문 게시판
                        </Link>
                     </MenuItem>
                     <MenuItem onClick={handleClose}>
                        <Link to="/board/inquiry" style={{ textDecoration: 'none', color: 'inherit' }}>
                           문의 게시판
                        </Link>
                     </MenuItem>
                  </Menu>
                  <Link to="/admin">
                     <NavItem>관리</NavItem>
                  </Link>
               </NavMenu>
            </LeftSection>
            <RightSection>
               <Link to="/notifications">
                  <NotificationIcon>:종:</NotificationIcon>
               </Link>
               <UserMenu>
                  Lee 님 <KeyboardArrowDownIcon />
               </UserMenu>
            </RightSection>
         </HeaderContent>
      </HeaderContainer>
   )
}
export default Header
// :별: Styled Components
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
   color: #000;
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
const NotificationIcon = styled.div`
   font-size: 20px;
   color: #ff7f00;
`
const UserMenu = styled.div`
   font-size: 16px;
   font-weight: 600;
   color: #000;
   display: flex;
   align-items: center;
   gap: 5px;
   cursor: pointer;
   &:hover {
      color: #ff7f00;
   }
`
