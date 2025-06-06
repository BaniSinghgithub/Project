import React, { useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
// import "../App.css"

function Navbar() {
  const navigate = useNavigate();
  const userdata = sessionStorage.getItem("token");

  const handleLogout = () =>{
    sessionStorage.removeItem("token");
    navigate("/");
    window.location.reload();         // refresh the page
  }

  useEffect(()=>{
    if(!userdata){
      navigate("/");
    }
  },[])

  return (
    <div className="navbar">
      <div className="title">Enquiry Form</div>
      {userdata? (

      <div className="">
        <Link to="/signup" onClick={handleLogout} className="signout">Sign out</Link>
      </div>
      ):(

      <div className="login">
        <Link to="/signup" className="sign">
          Sign up
        </Link>
        <Link to="/login" className="log">
          Login
        </Link>
      </div>
      )
    }
    </div>
  );
}

export default Navbar;
