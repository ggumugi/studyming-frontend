import CreateMingShop from '../components/page/CreateMingShop'

function EditMingShopPage({ isAuthenticated, user }) {
   return (
      <>
         <CreateMingShop isAuthenticated={isAuthenticated} user={user} />
      </>
   )
}

export default EditMingShopPage
