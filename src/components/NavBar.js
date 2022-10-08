import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './navBarStyle.css'
import { Link} from 'react-router-dom'
function NavBar({ title ,createdBy}) {
     const logOutHandler = () =>{
          localStorage.removeItem("UserID");
          localStorage.setItem("user", false)
          localStorage.removeItem("User");
          window.location.reload(false)
     }


     return (
          <Navbar expand="lg" variant="light" bg="light">
               <Container>
                    <Navbar.Brand href="#">

                         {!window.location.href.split('/')[3] === "bid" &&
                              <>
                                   <p>Hi Danial</p>
                              </>
                         }
                         <h3><b>{title}</b></h3>
                    </Navbar.Brand>
                    {
                         window.location.href.split('/')[3] === "bid" &&
                         <>
                              <p className="created_by">Created by: {createdBy}</p>
                              <div>
                                   <Link to='/home'>
                                        <button type="button" className="btn btn-primary home_button">Home</button>
                                   </Link>
                                   
                                        <button type="button" className="btn btn-danger"  onClick={()=>logOutHandler()}>Log out</button>
                                   
                              </div>
                         </>
                    }


                    {
                         window.location.href.split('/')[3] === "home" &&
                         <button type="button" className="btn btn-danger"  onClick={()=>logOutHandler()}>Log out</button>
                    }
                    {
                         window.location.href.split('/')[3] === "newAuction" &&
                         <>
                              <div>
                                   <Link to='/home'>
                                        <button type="button" className="btn btn-primary home_button">Home</button>
                                   </Link>
                                   
                                        <button type="button" className="btn btn-danger" onClick={()=>logOutHandler()}>Log out</button>
                                   

                              </div>
                         </>
                    }

               </Container>
          </Navbar>
     );
}

export default NavBar;