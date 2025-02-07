import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Header from './components/shared/Header'
import Footer from './components/shared/Footer'
import WelcomePage from './pages/WelcomePage'
// import Sidebar from './components/shared/Sidebar'

function App() {
   return (
      <BrowserRouter>
         <Header />
         <WelcomePage />
         {/* <Sidebar/> */}
         <Footer />
      </BrowserRouter>
   )
}

export default App
