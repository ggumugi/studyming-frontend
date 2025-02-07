import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Header from './components/shared/Header'
import Footer from './components/shared/Footer'
import First from './components/pages/First'
// import Sidebar from './components/shared/Sidebar'

function App() {
   return (
      <BrowserRouter>
         <Header />
         <First />
         {/* <Sidebar/> */}
         <Footer />
      </BrowserRouter>
   )
}

export default App
