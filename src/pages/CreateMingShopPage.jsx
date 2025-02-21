import CreateMingShop from '../components/page/CreateMingShop'

function CreateMingShopPage({ isAuthenticated, user }) {
   return (
      <>
         <CreateMingShop isAuthenticated={isAuthenticated} user={user} />
      </>
   )
}

export default CreateMingShopPage
