import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function RedirectLoginRoute({ children }) {
   const { isAuthenticated, loading } = useSelector((state) => state.auth)

   // 로딩 중 일때는 화면에 아무것도 렌더링하지 X
   if (loading) return null

   // 로그인 상태일 경우 홈으로 리다이렉트
   if (isAuthenticated) {
      return <Navigate to="/home" />
   }

   // 로그인 상태가 아니라면 children 컴포넌트 렌더링
   return children
}

export default RedirectLoginRoute
