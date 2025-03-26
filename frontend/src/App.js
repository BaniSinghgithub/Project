import React, { useEffect, useState } from "react";
import axios from "axios";
// import Form from "./form";
import SignUp from "./signUp";
// import Navbar from "./navbar";

function App() {
  const [message, setMessage] = useState("");  // just to check backend data

  useEffect(() => {
    axios.get("http://localhost:5000/api/message")
      .then(response => setMessage(response.data))
      .catch(error => console.error("Error fetching message:", error));
  }, []);

  return (
    <div className="main">
      {/* <h1 className="backend">{message}</h1> */}
      {/* <Form /> */}
      <SignUp />
    </div>
  );
}

export default App;
