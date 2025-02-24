import { useParams } from 'react-router-dom'
import BoardDetail from '../components/board/BoardDetail'

const BoardDetailPage = ({ isAuthenticated, user }) => {
   const { id } = useParams() // ✅ URL에서 id 가져오기

   return (
      <>
         <BoardDetail isAuthenticated={isAuthenticated} user={user} postId={id} />
      </>
   )
}

export default BoardDetailPage
