// Utilities
import './supports/stylesheets/utilities.css'

import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from "./components/navbar";
import Register from "./pages/register/register";
import Login from "./pages/login/login";
import Home from "./pages/home/home";
import Menu from './pages/menu/menu';
import { useEffect, useState } from 'react';
import DetailProduct from './pages/detail/detail';

import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export default function App(){
  const [username, setUsername] = useState('')
  const [redirect, setRedirect] = useState(false)

  useEffect(() => {
    checkIsLogin()
  }, [])

  let checkIsLogin = async() => {
    try{
      let getTokenId = localStorage.getItem('token')
      if(getTokenId) {
        let response = await axios.get(`https://my-json-server.typicode.com/ginanjarjtp/jsonserver-jcwd2302/users?id=${getTokenId}`)
        setUsername(response.data[0].username)
        setRedirect(true)
      }
    } catch (error){
    
    }
  }

  let onLogin = async(inputUsername, inputPassword) => {
    try {
        // Step 0. Get Value Input
        // Step 1. Check is Username & Pasword exist
        let response = await axios.get(`https://my-json-server.typicode.com/ginanjarjtp/jsonserver-jcwd2302/users?username=${inputUsername}&${inputPassword}`)
        if(response.data.length === 0) throw {message: 'Account not found'} // If data not found, throw error
        localStorage.setItem('token', `${response.data[0].id}`) 
        setUsername(response.data[0].username)
        toast('Login Success');
        setTimeout(() => {
          setRedirect(true)
        }, 3000)
    } catch (error) {
      console.log(error)
        toast(error.message)
    }
  }

  let onLogout = () => {
    localStorage.removeItem('token')
    setRedirect(false)
    setUsername('')
  }
  
  return(
    <>
      <Navbar data={{username}} myFunc={{onLogout}}/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register isRedirect={{redirect}} />} />
          <Route path='/login' element={<Login myFunc={{onLogin}} isRedirect={{redirect}}/>} />
          <Route path='/menu'  element={<Menu />} />
          <Route path='/product/:id'  element={<DetailProduct />} /> 
          {/* titik dua : adalah params */}
        </Routes>
      <Toaster />
    </>
  )
}