import BoardSidebar from '../components/sidebar/BoardSidebar'
import { BrowserRouter } from 'react-router-dom'

function BoardListPage({ isAuthenticated, user }) {
   return (
      <>
         <BoardSidebar isAuthenticated={isAuthenticated} user={user} />
      </>
   )
}

export default BoardListPage
