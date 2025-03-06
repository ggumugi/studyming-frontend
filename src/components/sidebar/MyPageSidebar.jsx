import React from 'react'
import styled from 'styled-components'

const MyPageSidebar = ({ selectedMenu, setSelectedMenu }) => {
   const menuList = ['내 정보', '내 아이템', '결제 및 밍 내역', '회원 탈퇴']

   return (
      <SidebarContainer>
         <MenuList>
            {menuList.map((item) => (
               <MenuItem key={item} $isActive={selectedMenu === item} onClick={() => setSelectedMenu(item)}>
                  <StyledButton>{item}</StyledButton>
                  {selectedMenu === item && <ActiveIndicator />}
               </MenuItem>
            ))}
         </MenuList>
      </SidebarContainer>
   )
}

export default MyPageSidebar

// ⭐ Styled Components
const SidebarContainer = styled.nav`
   width: 300px;
   height: 120vh;
   padding: 20px;
   display: flex;
   flex-direction: column;
   border-right: 1px solid #ddd;

   @media (max-width: 965px) {
      width: 100%;
      height: auto;
      flex-direction: row;
      border-right: none;
      border-bottom: 2px solid #ddd;
      justify-content: center;
      align-items: center;
      padding: 10px 0;
      margin-left: 0px;
   }
`

const MenuList = styled.ul`
   margin-top: 170px;
   list-style: none;
   padding: 0;
   display: flex;
   flex-direction: column;
   align-items: flex-end;
   gap: 70px;

   @media (max-width: 965px) {
      flex-direction: row;
      margin-top: 10px;
      gap: clamp(80px, 20vw, 200px);
   }
`

const MenuItem = styled.li`
   position: relative;
   display: flex;
   margin-right: 20px;
   justify-content: center;
   font-size: 20px;
   font-weight: ${(props) => (props.$isActive ? '500' : '300')};
   color: ${(props) => (props.$isActive ? '#FF7A00' : '#000')};
   cursor: pointer;

   @media (max-width: 965px) {
      margin-right: 0;
   }
`

const StyledButton = styled.button`
   all: unset;
   text-align: right;
   display: block;
   font-size: inherit;
   color: inherit;
   cursor: pointer;
   &:hover {
      color: #ff7f00;
   }
`

const ActiveIndicator = styled.div`
   position: absolute;
   right: -44px;
   top: 50%;
   transform: translateY(-50%);
   width: 8px;
   height: 8px;
   background-color: #ff7f00;
   border-radius: 50%;

   @media (max-width: 965px) {
      right: auto;
      top: 135%;
      left: 50%;
      transform: translateX(-50%);
   }
`
