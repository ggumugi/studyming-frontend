// 스터디 생성
import StudyDetail from '../components/Study/StudyDetail'
//ui툴만 구현.

const StudyDetailPage = ({ isAuthenticated, user }) => {
   return (
      <>
         <StudyDetail isAuthenticated={isAuthenticated} user={user} />
      </>
   )
}

export default StudyDetailPage
