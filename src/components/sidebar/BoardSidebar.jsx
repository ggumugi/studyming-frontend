import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCategory } from '../../features/postSlice' // ✅ Redux 액션 임포트

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
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const selectedCategory = useSelector((state) => state.posts.category)

   const handleCategoryClick = (category) => {
      const backendCategory = categoryMap[category]
      dispatch(setCategory(backendCategory)) // ✅ Redux 상태 업데이트
      navigate('/board') // ✅ 네비게이션 이동
   }

   return (
      <Container>
         <SidebarContainer>
            <MenuList>
               {Object.keys(categoryMap).map((item) => (
                  <MenuItem key={item} $isActive={categoryMap[item] === selectedCategory} onClick={() => handleCategoryClick(item)}>
                     <StyledButton>{item}</StyledButton>

                     {categoryMap[item] === selectedCategory && <ActiveIndicator />}
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
   width: clamp(100px, 10vw, 200px);
   margin-left: 20px;
   height: 100vh;
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
   margin-top: 120px;
   list-style: none;
   padding: 0;
   display: flex;
   flex-direction: column;
   align-items: flex-end;
   gap: 70px;

   @media (max-width: 965px) {
      flex-direction: row;
      margin-top: 10px;
      gap: clamp(30px, 1vw, 50px);
   }
`

const MenuItem = styled.li`
   flex-direction: column;
   position: relative;
   display: flex;
   margin-right: 20px;
   justify-content: center;
   font-size: clamp(14px, 2vw, 20px);
   font-weight: ${(props) => (props.$isActive ? '500' : '300')};
   color: ${(props) => (props.$isActive ? '#FF7A00' : '#000')};
   cursor: pointer;

   @media (max-width: 965px) {
      margin-right: 0;
   }
`

const ActiveIndicator = styled.div`
   position: absolute;
   right: -44px;
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
