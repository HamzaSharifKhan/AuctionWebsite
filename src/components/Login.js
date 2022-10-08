import React, { useRef, useState } from "react"
// import {firebase} from "firebase/app"
import { Form, Button, Card } from "react-bootstrap"
// import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { Container } from "react-bootstrap"
import toast, { Toaster } from 'react-hot-toast';
import { doc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase"
export default function Login({ AuthLogin }) {
  const auth = getAuth()
  const emailRef = useRef()
  const passwordRef = useRef()
  const navigate = useNavigate()
  // const { login } = useAuth()

  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    signInWithEmailAndPassword(auth, emailRef.current.value, passwordRef.current.value)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        fetchUserData(user.uid)
        toast.success("Login successfully")
        setLoading(false)

        // ...
      })
      .catch((error) => {
        toast.error(error.message)
        setLoading(false)
      });

    ///


  }

  const fetchUserData = async (id) => {
    const docRef = doc(db, "Users", id)
    getDoc(docRef)
      .then((doc) => {
        localStorage.setItem("User", JSON.stringify(doc.data()));
        localStorage.setItem("UserID", JSON.stringify(id));
        AuthLogin();
        navigate('/home')
      })

  }
  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Card className="w-100" style={{ maxWidth: "400px" }}>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} />
              </Form.Group>
              {
                !loading ?
                  <Button className="w-100" type="submit">
                    Log In
                  </Button>
                  :
                  <Button className="w-100" type="submit">
                    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                  </Button>

              }

             
            </Form>
            {/* <div className="w-100 text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div> */}
          </Card.Body>
          <div className="w-100 text-center mt-2">
            Need an account? <Link to="/signup">Sign Up</Link>
          </div>
        </Card>
        <Toaster />
      </Container>
    </>
  )
}
