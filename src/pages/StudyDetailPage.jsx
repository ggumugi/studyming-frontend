import React, { useEffect } from 'react'
import StudyDetail from '../components/Study/StudyDetail'

const StudyDetailPage = ({ isAuthenticated, user }) => {
   // isAuthenticated가 true인 경우에만 StudyDetail 렌더링
   return <>{isAuthenticated && <StudyDetail isAuthenticated={isAuthenticated} user={user} />}</>
}

export default StudyDetailPage
