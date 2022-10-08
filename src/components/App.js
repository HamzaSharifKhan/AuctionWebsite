import React, { useEffect, useState } from "react"
import Signup from "./Signup"
// import { Container } from "react-bootstrap"
// import { AuthProvider } from "../contexts/AuthContext"
import {  Routes, Route,Navigate } from "react-router-dom"
import Login from "./Login"
import Home from "./home/Home"
import NewAuction from "./newAuction/NewAuction"
import Bid from "./biding/Bid"


function App() {
  const [user, setuser] = useState(null)
  useEffect(() => {
    const u = localStorage.getItem("user");
    u && JSON.parse(u) ? setuser(true) : setuser(false);
  }, [])
  useEffect(() => {
    localStorage.setItem("user", user)
  }, [user]);
  const handleAuthUser = () =>{
    setuser(true)
  }
  return (
    <div >
      <Routes>
        <>
          {!user && (
            <>
              <Route path="/" element={<Login AuthLogin={handleAuthUser} />} />
              <Route path="/signup" element={<Signup/>} />
            </>
          )}
          {user && (
            <>
              <Route path="/home" element={<Home/>} />
              <Route path="/newAuction" element={<NewAuction/>} />
              <Route path="/bid" element={<Bid/>} />
            </>
          )}
          <Route path="*" element={<Navigate to={user?"/home":"/"}/>}></Route>
        </>
      </Routes>
    </div>
  )
}

export default App
