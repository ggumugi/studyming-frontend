import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BoardSidebar from '../components/sidebar/BoardSidebar'
import BoardDetail from '../components/board/BoardDetail'
import styled from 'styled-components'

const BoardDetailPage = ({ isAuthenticated, user }) => {
   const { id } = useParams() // ✅ URL에서 id 가져오기
   const [selectedCategory, setSelectedCategory] = useState('자유') // 기본 선택 카테고리

   return (
      <BoardContainer>
         <BoardSidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
         <BoardDetail isAuthenticated={isAuthenticated} user={user} postId={id} />
      </BoardContainer>
   )
}
const BoardContainer = styled.div`
   display: flex;
   flex-direction: row;
   width: 100%;

   @media (max-width: 965px) {
      flex-direction: column; /* 화면이 965px 이하일 때 상하 정렬 */
   }
`

export default BoardDetailPage
