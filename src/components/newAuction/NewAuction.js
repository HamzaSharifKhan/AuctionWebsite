import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import NavBar from '../../Navbar/NavBar'
import { Form, Button, Card } from "react-bootstrap"
import './newAuctionStyle.css'
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../firebase'
import toast, { Toaster } from 'react-hot-toast';
export default function NewAuction() {
     const userDetail = JSON.parse(localStorage.getItem('User'))
     const [productName, setProductName] = useState()
     const [startingBid, setStartingBid] = useState()
     const [description, setDescription] = useState()
     const [date, setDate] = useState()
     const [loader, setLoader] = useState(false)
     const handleNewAuction = async (e) => {
          setLoader(true)
          e.preventDefault()
          try {
               await addDoc(collection(db, "Auction"), {
                    productName: productName,
                    sellerID: userDetail.userId,
                    sellerName: userDetail.name,
                    topBid: startingBid,
                    endDateforBiding: date,
                    topBidUser: userDetail.name,
                    topBidUserId: userDetail.userId,
                    Description: description,
                    itemId: Math.floor(1000000000 + Math.random() * 999999999),
               });
               setProductName("")
               setDate("")
               setDescription("")
               setStartingBid("")
               setLoader(false)
               toast.success("Item launch successfully")
          }
          catch (e) {
               toast.error(e.message)
          }
     }

     return (
          <>
               <Container>
                    <NavBar title="New Auction" />
                    <Card className="w-100" style={{ maxWidth: "1200px" }}>
                         <Card.Body>
                              <h2 className="text-center mb-4">New Auction</h2>
                              <Form onSubmit={handleNewAuction}>
                                   <Form.Group>
                                        <Form.Label className='label'>Product Name:</Form.Label>
                                        <Form.Control type="text" required placeholder='Cricket Bat' onChange={(e) => setProductName(e.target.value)} value={productName} />
                                   </Form.Group>
                                   <Form.Group >
                                        <Form.Label className='label'>Starting Bid:</Form.Label>
                                        <Form.Control type="number" placeholder='500' onChange={(e) => setStartingBid(e.target.value)} required value={startingBid} />
                                   </Form.Group>
                                   <Form.Group >
                                        <Form.Label className='label'>Description:</Form.Label>
                                        <Form.Control as="textarea" rows={3} onChange={(e) => setDescription(e.target.value)} required value={description} />
                                   </Form.Group>
                                   <Form.Group controlId="duedate">
                                        <Form.Label className='label'>Date:</Form.Label>
                                        <Form.Control type="date" name="duedate" onChange={(e) => setDate(e.target.value)} placeholder="Due date" min={new Date().toISOString().split('T')[0]} required value={date} />
                                   </Form.Group>
                                   <center>
                                        {loader ?

                                             <Button className="w-50" type="button" disabled>
                                                  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                                  Please wait...
                                             </Button>
                                             :
                                             <Button className="w-50" type="submit">
                                                  Create Auction
                                             </Button>
                                        }
                                   </center>
                              </Form>
                         </Card.Body>
                    </Card>
                    <Toaster />
               </Container>
          </>
     )
}
