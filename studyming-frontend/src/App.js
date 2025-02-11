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
import BoardDetailPage from './pages/BoardDetailPage'
import MyPage from './pages/MyPage'
import FindIdPage from './pages/FindIdPage'
import FindPasswordPage from './pages/FindPasswordPage'
import StudyListPage from './pages/StudyListPage'
import StudyGroupPage from './pages/StudyGroupPage'
import MingShopPage from './pages/MingShopPage'

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
            <Route path="/find/id" element={<FindIdPage />} />
            <Route path="/find/password" element={<FindPasswordPage />} />
            <Route path="/board" element={<BoardListPage />} />
            <Route path="/board/create" element={<BoardCreatePage />} />
            <Route path="/board/edit/:id" element={<BoardEditPage />} />
            <Route path="/board/detail/:id" element={<BoardDetailPage />} />
            <Route path="/mypage" element={<MyPage />} />
<<<<<<< HEAD
            <Route path="/study/list" element={<StudyListPage />} />
=======
            <Route path="/study-list" element={<StudyListPage />} />
            <Route path="/studygroup/:id" element={<StudyGroupPage />} />
            <Route path="/mingshop" element={<MingShopPage />} />
>>>>>>> 823d7cc04e0355670e71e8afe327e9ebe3619733
         </Routes>
         {/* <Sidebar/> */}
         <Footer />
      </>
   )
}

export default App
