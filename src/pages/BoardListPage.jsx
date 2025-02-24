/* import BoardSidebar from '../components/sidebar/BoardSidebar'
import { BrowserRouter } from 'react-router-dom'

function BoardListPage({ isAuthenticated, user }) {
   return (
      <>
         <BoardSidebar isAuthenticated={isAuthenticated} user={user} />
      </>
   )
}

export default BoardListPage
 */

import { useState } from 'react'
import BoardSidebar from '../components/sidebar/BoardSidebar'
import BoardList from '../components/board/BoardList'

function BoardListPage() {
   const [selectedCategory, setSelectedCategory] = useState('자유') // 기본 선택 카테고리

   return (
      <div style={{ display: 'flex' }}>
         <BoardSidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
         <BoardList category={selectedCategory} />
      </div>
   )
}

export default BoardListPage
