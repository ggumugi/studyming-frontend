import React from 'react'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'

// 한글 카테고리 <-> 백엔드 enum 매핑
const categoryMap = {
   자유: 'free',
   질문: 'QnA',
   정보: 'noti',
   문의: 'inquiry',
}

const reverseCategoryMap = {
   free: '자유',
   QnA: '질문',
   noti: '정보',
   inquiry: '문의',
}

const BoardSidebar = () => {
   const navigate = useNavigate()
   const { category } = useParams() // ✅ URL에서 현재 카테고리 가져오기

   const handleCategoryClick = (selectedCategory) => {
      navigate(`/board/${categoryMap[selectedCategory]}`) // ✅ 선택된 카테고리를 백엔드 enum 값으로 변환 후 이동
   }

   return (
      <Container>
         <SidebarContainer>
            <MenuList>
               {Object.keys(categoryMap).map((item) => (
                  <MenuItem key={item} $isActive={categoryMap[item] === category} onClick={() => handleCategoryClick(item)}>
                     <StyledButton>{item}</StyledButton>
                     {categoryMap[item] === category && <ActiveIndicator />}
                  </MenuItem>
               ))}
            </MenuList>
         </SidebarContainer>
      </Container>
   )
}

export default BoardSidebar

// ⭐ Styled Components
const Container = styled.div`
   display: flex;
   height: 100%;
   margin-bottom: 50px;
`

const SidebarContainer = styled.nav`
   width: 220px;
   height: 100vh;
   padding: 20px;
   display: flex;
   flex-direction: column;
   border-right: 1px solid #ddd;
   align-items: flex-end;
`

const MenuList = styled.ul`
   margin-top: 170px;
   list-style: none;
   padding: 0;
   display: flex;
   flex-direction: column;
   align-items: flex-end;
   gap: 70px; /* ✅ 메뉴 간 간격 */
`

const MenuItem = styled.li`
   position: relative;
   display: flex;
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

const ActiveIndicator = styled.div`
   position: absolute;
   right: -44px; /* ✅ 오른쪽에 동그라미 위치 */
   width: 8px;
   height: 8px;
   background-color: #ff7f00;
   border-radius: 50%;
`
