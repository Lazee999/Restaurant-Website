import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import FoodDisplay from './components/FoodDisplay/FoodDisplay';
import HealthyDisplay from './components/HealthyDisplay/HealthyDisplay'

const App = () => {


  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <> </>}

      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Routes >
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path="/foodmenu" element={<FoodDisplay category="All" />} />
          <Route path="/healthymenu" element={<HealthyDisplay categoryhealth="All" />} />
        </Routes >
      </div>
      <Footer />
    </>

  )
}

export default App