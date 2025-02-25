import AdminBoardSidebar from '../components/sidebar/AdminBoardSidebar'

function AdminPage({ isAuthenticated, user }) {
   return (
      <>
         <AdminBoardSidebar isAuthenticated={isAuthenticated} user={user} />
      </>
   )
}

export default AdminPage
