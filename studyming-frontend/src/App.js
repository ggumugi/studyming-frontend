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
import CreateMingShopPage from './pages/CreateMingShopPage'
import AdminPage from './pages/AdminPage'
import StudyCreatePage from './pages/StudyCreatePage'
import StudyDetailPage from './pages/StudyDetailPage'
import StudyEditPage from './pages/StudyEditPage'
import StudyLeaderExitPendingPage from './pages/StudyLeaderExitPendingPage'
import StudyLeaderTransfarPage from './pages/StudyLeaderTransfarPage'
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
            <Route path="/studygroup/:id" element={<StudyGroupPage />} />
            <Route path="/mingshop" element={<MingShopPage />} />
            <Route path="/mingshop/create" element={<CreateMingShopPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/study/list" element={<StudyListPage />} />
            <Route path="/study/create" element={<StudyCreatePage />} />
            <Route path="/study/detail/:id" element={<StudyDetailPage />} />
            <Route path="/study/edit/:id" element={<StudyEditPage />} />
            <Route path="/study/leader/exit" element={<StudyLeaderExitPendingPage />} />
            <Route path="/study/leader/transfar" element={<StudyLeaderTransfarPage />} />
         </Routes>
         {/* <Sidebar/> */}
         <Footer />
      </>
   )
}

export default App
