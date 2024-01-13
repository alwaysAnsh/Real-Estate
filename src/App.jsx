import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import Profile from './pages/Profile'
import About from './pages/About'
import SignUp from './pages/SignUp'


function App() {
  

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signin' element={<SignIn/>} />
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/about' element={<About/>} />
      </Routes>
    </>
  )
}

export default App
