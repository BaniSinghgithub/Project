import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App";
import SignUp from "./signUp";
import Login from "./login";
import Form from "./form";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Define Routes
const routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/form",
    element: <Form />,
  }
]);

// Render
root.render(
  // adding google auth
  <GoogleOAuthProvider clientId="713538226120-ir1j3kuqm78lvi7432hd8stmtcp3co60.apps.googleusercontent.com">   
    <React.StrictMode>
      <RouterProvider router={routers} />
    </React.StrictMode>
  </GoogleOAuthProvider>
);
