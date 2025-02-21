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
import FindPwquestionPage from './pages/FindPwquestionPage'
import StudyListPage from './pages/StudyListPage'
import StudyGroupPage from './pages/StudyGroupPage'
import MingShopPage from './pages/MingShopPage'
import CreateMingShopPage from './pages/CreateMingShopPage'
import AdminPage from './pages/AdminPage'
import StudyCreatePage from './pages/StudyCreatePage'
import StudyDetailPage from './pages/StudyDetailPage'
import StudyEditPage from './pages/StudyEditPage'
import StudyLeaderExitPendingPage from './pages/StudyLeaderExitPendingPage'
import StudyLeaderTransferPage from './pages/StudyLeaderTransferPage'
import InfoPage from './pages/InfoPage'
import EditMingShopPage from './pages/EditMingShopPage'
// import Sidebar from './components/shared/Sidebar'

import { checkAuthStatusThunk } from './features/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

function App() {
   const dispatch = useDispatch()
   const { isAuthenticated, user } = useSelector((state) => state.auth)

   useEffect(() => {
      dispatch(checkAuthStatusThunk())
   }, [dispatch])
   return (
      <>
         <Header isAuthenticated={isAuthenticated} user={user} />
         <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<Home isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/find/id" element={<FindIdPage />} />
            <Route path="/find/password" element={<FindPasswordPage />} />
            <Route path="/board" element={<BoardListPage isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/board/create" element={<BoardCreatePage isAuthenticated={isAuthenticated} user={user} />} />
            {/* <Route path="/board/edit/:id" element={<BoardEditPage />} /> */}
            {/* <Route path="/board/detail/:id" element={<BoardDetailPage />} /> */}
            <Route path="/mypage" element={<MyPage isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/studygroup/:id" element={<StudyGroupPage isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/mingshop" element={<MingShopPage isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/mingshop/create" element={<CreateMingShopPage isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/mingshop/edit/:id" element={<EditMingShopPage isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/admin" element={<AdminPage isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/study/list" element={<StudyListPage isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/study/create" element={<StudyCreatePage isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/study/detail/:id" element={<StudyDetailPage isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/study/edit/:id" element={<StudyEditPage isAuthenticated={isAuthenticated} user={user} />} />
            <Route path="/study/leader/exit" element={<StudyLeaderExitPendingPage />} isAuthenticated={isAuthenticated} user={user} />
            <Route path="/study/leader/transfer" element={<StudyLeaderTransferPage />} isAuthenticated={isAuthenticated} user={user} />
         </Routes>
         {/* <Sidebar/> */}
         <Footer />
      </>
   )
}

export default App
