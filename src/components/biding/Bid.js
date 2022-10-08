import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import NavBar from '../../Navbar/NavBar'
import { Card } from "react-bootstrap"
import '../newAuction/newAuctionStyle.css'
import './bidStyle.css'
import toast, { Toaster } from 'react-hot-toast';
import { useLocation ,useNavigate} from 'react-router-dom'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
export default function Bid() {
     const navigate = useNavigate()
     const location = useLocation();
     const auctionItemData = location.state.auctionItemData
     const AuctionItemID = location.state.ItemId
     const [newBid, setNewBid] = useState()
     const [loader, setLoader] = useState(false)
     const [userData, setUserData] = useState()
     const userId = JSON.parse(localStorage.getItem("UserID"))
     const userName = JSON.parse(localStorage.getItem("User")) 
     useEffect(() => {
          const docRef = doc(db, 'Users', userId)
          getDoc(docRef)
               .then((doc) => {
                    setUserData(doc.data())
               })
     }, [])
     const handleEnterBid = async () => {
          setLoader(true)
          if (parseFloat(auctionItemData.topBid) >= parseFloat(newBid)) {
               toast.error("Your bid is less than top bid ")
               setLoader(false)
               return
          }
          if (userData.wallet < parseFloat(newBid)) {
               toast.error("Your wallet balance is insufficient")
               setLoader(false)
               return
          }
          try {
               const docRef = doc(db, 'Auction', AuctionItemID)
               await updateDoc(docRef, {
                    topBid: newBid,
                    topBidUser: userName.name

               })
               toast.success("Your bid is now highest")
          } catch (e) {
               toast.error("Server encounter an unexception condition")
          }
          const newBalance = userData.wallet - parseFloat(newBid)
          // The User Wallet Balnce handle
          try {
               const docRef = doc(db, 'Users', userId)
               await updateDoc(docRef, {
                    wallet: newBalance
               })
               setLoader(false)
               navigate("/homes")
               setTimeout(() => {
                    toast.success(`Your remaining balance is: ${newBalance}`)
                    return
               }, 1000)
          } catch (e) {
               toast.error("Server encounter an unexception condition")
          }
     }
     return (
          <Container>
               <NavBar title={auctionItemData.productName} createdBy={auctionItemData.sellerName} />
               <Card className="w-100" style={{ maxWidth: "1200px" }}>
                    <Card.Body>
                         <h6 className='time_tag'>Time Remaining: {auctionItemData.timeRemaining} Days</h6>
                         <p>{auctionItemData.Description}</p>
                         <div className="biding_information">
                              <div>
                                   <p className='hieghest_bid'>Current High Bid</p>
                                   <p className='hieghest_bid'>{auctionItemData.topBid}</p>
                              </div>
                              <div>
                                   <p className='hieghest_bid'>By:  {auctionItemData.topBidUser}</p>
                              </div>
                         </div>
                         <footer className='Input_Box'>
                              <label className='your_Bid'>Your Bid:</label>
                              <input type='text' placeholder='Enter your Bid' className='input_for_new_bids' onChange={(e) => { setNewBid(e.target.value) }}></input>
                              {!loader ?
                                   <button type="button" className="btn btn-sm btn-success bid_button" onClick={() => handleEnterBid()}>Enter Bid</button>
                                   :
                                   <button type="button" className="btn btn-sm btn-success bid_button">
                                        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>  
                                        Please wait        
                                   </button> 
                              }
                         </footer>
                    </Card.Body>
               </Card>
               <Toaster />
          </Container>
     )
}
