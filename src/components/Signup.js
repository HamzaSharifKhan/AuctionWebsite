import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
// import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { Container } from "react-bootstrap"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc,} from "firebase/firestore";
import { db } from "../firebase"
import toast, { Toaster } from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate()
  const auth = getAuth();
  const emailRef = useRef()
  const nameRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  async function handleSubmit(e) {
    e.preventDefault()
    var name =nameRef.current.value
    var password =passwordRef.current.value
    if(name.length<=3 || name.length>20){
       toast.error("The number of Name characters should be greater than 3 and less than 20")
       return
    }
    if(password.length<8){
      toast.error("The max password length should be 8")
      return
    }

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      toast.error("Passwords do not match")
    }
    setLoading(true)

    try {
      setError("")

      const res = await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      // Set the ID and Add Collection of User
      await setDoc(doc(db, "Users", res.user.uid), {
        name: nameRef.current.value,
        email: emailRef.current.value,
        wallet: 1000,
        userId: Math.floor(1000000000 + Math.random() * 999999999)
      })
      navigate("/")
      toast.success("Acount is created successfully")
      // history.push("/")
    } catch(e) {
      setError("Failed to create an account")
      toast.error(e.message)
    }

    setLoading(false)
  }

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Card className="w-100" style={{ maxWidth: "400px" }}>
          <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" ref={nameRef} />
              </Form.Group>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type="password" ref={passwordConfirmRef} required />
              </Form.Group>
              {
                !loading ?
                  <Button className="w-100" type="submit">
                    Sign up
                  </Button>
                  :
                  <Button className="w-100" type="submit">
                    <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                  </Button>


              }
            </Form>
          </Card.Body>
          <div className="w-100 text-center mt-2">
            Already have an account? <Link to="/">Log In</Link>
          </div>
        </Card>
        <Toaster />
      </Container>
    </>
  )
}
