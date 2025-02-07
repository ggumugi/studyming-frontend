import './styles/common.css'
import { Route, Routes } from 'react-router-dom'

import Header from './components/shared/Header'
import Footer from './components/shared/Footer'
import WelcomePage from './pages/WelcomePage'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import BoardListPage from './pages/BoardListPage'
import BoardCreatePage from './pages/BoardCreatePage'
import BoardEditPage from './pages/BoardEditPage'
import BoardDetail from './pages/BoardDetail'
import MyPage from './pages/MyPage'

// import Sidebar from './components/shared/Sidebar'

function App() {
   return (
      <>
         <Header />
         <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/board" element={<BoardListPage />} />
            <Route path="/board/create" element={<BoardCreatePage />} />
            <Route path="/board/edit/:id" element={<BoardEditPage />} />
            <Route path="/board/detail/:id" element={<BoardDetail />} />
            <Route path="/mypage" element={<MyPage />} />
         </Routes>

         {/* <Sidebar/> */}

         <Footer />
      </>
   )
}

export default App
