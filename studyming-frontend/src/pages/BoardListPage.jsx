import Footer from '../components/shared/Footer'
import Header from '../components/shared/Header'
import BoardSidebar from '../components/sidebar/BoardSidebar'
import { BrowserRouter } from 'react-router-dom'

function BoardListPage() {
   return (
      <>
         <Header />
         <BoardSidebar />
         <Footer />
      </>
   )
}

export default BoardListPage
