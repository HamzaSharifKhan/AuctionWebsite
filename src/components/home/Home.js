import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast';
import { db } from '../../firebase';
import './homeStyle.css'
import NavBar from '../../Navbar/NavBar';
export default function Home() {
     const userDetail = JSON.parse(localStorage.getItem('User'))
     const [array, setArray] = useState([])
     const [data, setData] = useState([])
     const [loader, setLoader] = useState(true)
     const [ItemId, setItemId] = useState([])
     const [userData, setUserData] = useState()
     const userId = JSON.parse(localStorage.getItem("UserID"))
     let list = []
     let Ids = []

     useEffect(() => {


          //Get all the Data from the Firebase
          const fetchData = async () => {
               try {
                    const querySnapshot = await getDocs(collection(db, "Auction"));
                    querySnapshot.forEach((doc, index) => {
                         list.push(doc.data())
                         Ids.push(doc.id)
                    })
                    setItemId(Ids)
                    setData(list)
                    setLoader(false)
               } catch (error) {
                    console.log("The error is", error)
               }

          }
          fetchData()

          // Fetch Single User Data
          const docRef = doc(db, 'Users', userId)
          getDoc(docRef)
               .then((doc) => {
                    setUserData(doc.data())
               })
     }, [])

     useEffect(() => {
         //Sorting Dates 
          data.map((ls, index) => {
               let date_1 = new Date(ls.endDateforBiding);
               let date_2 = new Date();

               const days = (date_1, date_2) => {
                    let difference = date_1.getTime() - date_2.getTime();
                    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
                    ls.endDateforBiding = TotalDays;
                    ls.ItemFirebaseId = ItemId[index];
               }
               days(date_1, date_2)
          })

          setArray(data.sort((first_Argument, second_Argument) => parseFloat(first_Argument.endDateforBiding) - parseFloat(second_Argument.endDateforBiding)));
     }, [data])

     const handleDelete = (Item) => {
          const docRef = doc(db, 'Auction', Item.ItemFirebaseId)
          deleteDoc(docRef)
               .then(() => {
                    toast.success("Item has deleted")
               })
               .catch((e) => {
                    toast.error("Server encounter an unexception condition")
               })
          setArray(array.filter((ls) => ls.ItemFirebaseId != Item.ItemFirebaseId))
     }

     return (
          <Container>
               <main>
                    <NavBar title="Current Auction" />
                    {
                         loader ?
                              <div class="d-flex justify-content-center align-items-center">
                                   <div class="spinner-grow d-flex " role="status">
                                        <span class="sr-only">Loading...</span>
                                   </div>
                              </div>
                              :
                              <>
                                   <Table striped bordered hover >
                                        <tbody>
                                             <tr>
                                                  <td><b>Product</b></td>
                                                  <td><b>Seller</b></td>
                                                  <td><b>Top Bid</b></td>
                                                  <td><b>Days Remaining</b></td>
                                                  <td><b>Delete</b></td>
                                             </tr>
                                             {
                                                  array && array.map((item, index) =>
                                                       // Conditional rendering if Date has passed
                                                       <>
                                                            {(item.endDateforBiding <= 0) ?
                                                                 null
                                                                 :
                                                                 <tr key={index}>

                                                                      <td ><Link to='/bid' state={{ auctionItemData: item, ItemId: item.ItemFirebaseId }} style={{ textDecoration: "none" }}><span className="product">{item.productName}</span></Link></td>
                                                                      <td>{item.sellerName}</td>
                                                                      <td>{item.topBid}</td>
                                                                      <td>{item.endDateforBiding}</td>
                                                                      <td>{userDetail.userId === item.sellerID ? <span className="delete" data-toggle="modal" data-target="#exampleModal" onClick={() => handleDelete(item)}>Delete</span> : null}</td>
                                                                 </tr>
                                                            }
                                                       </>
                                                  )
                                             }
                                        </tbody>
                                   </Table>
                                   <footer className='lower_Home_Page'>
                                        <Link to='/newAuction'><button type="button" className="btn btn-primary">New Auction</button></Link>
                                        <p>Your current wallet: <span className='wallet'>{userData?.wallet}$</span></p>
                                   </footer>
                              </>
                    }
               </main>
               <Toaster />
          </Container>
     );
}
