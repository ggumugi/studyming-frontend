import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import BoardSidebar from '../components/sidebar/BoardSidebar'
import BoardDetail from '../components/board/BoardDetail'

const BoardDetailPage = ({ isAuthenticated, user }) => {
   const { id } = useParams() // ✅ URL에서 id 가져오기
   const [selectedCategory, setSelectedCategory] = useState('자유') // 기본 선택 카테고리

   return (
      <div style={{ display: 'flex' }}>
         <BoardSidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
         <BoardDetail isAuthenticated={isAuthenticated} user={user} postId={id} />
      </div>
   )
}

export default BoardDetailPage
