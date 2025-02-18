import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function AdminRoute({ children }) {
   const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

   // 로딩 중 일때는 화면에 아무것도 렌더링하지 X
   if (loading) return null

   // 인증되지 않았거나 관리자가 아닐경우 홈으로 리다이렉트
   if (!isAuthenticated || user?.role !== 'ADMIN') {
      return <Navigate to="/home" />
   }

   // 인증된 관리자인 경우 children 컴포넌트 렌더링
   return children
}

export default AdminRoute
