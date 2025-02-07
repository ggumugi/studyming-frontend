import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Menu, MenuItem } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { FaRegBell } from 'react-icons/fa' // 🔹 react-icons에서 종 아이콘 추가

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

                  <NavItem onClick={handleClick} isOpen={open}>
                     게시판 {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </NavItem>

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
               <NotificationIcon />
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
   color: ${(props) => (props.isOpen ? '#ff7f00' : '#000')};
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

// 🔹 FaBell 아이콘을 스타일링하여 적용
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
   color: #000;
   display: flex;
   align-items: center;
   gap: 5px;
   cursor: pointer;
   &:hover {
      color: #ff7f00;
   }
`
