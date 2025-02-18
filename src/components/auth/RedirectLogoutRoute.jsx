import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function RedirectLogoutRoute({ children }) {
   const { isAuthenticated, loading } = useSelector((state) => state.auth)

   // 로딩 중 일때는 화면에 아무것도 렌더링하지 X
   if (loading) return null

   // 로그인 안했을 경우 로그인 페이지로 리다이렉트
   if (!isAuthenticated) {
      return <Navigate to="/login" />
   }

   // 로그인 한 경우 children 컴포넌트 렌더링
   return children
}

export default RedirectLogoutRoute
