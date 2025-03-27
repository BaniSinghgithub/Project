import React, { useEffect } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast,ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

//make login page
const LoginPage = () => {
  // const [User, setUser] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const API_URL=process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("token"));
    if (user) {
      // setUser(user);
      navigate("/form");
    }
  }, []);

  const clientId =process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
        toast.error("Please enter email and password");
        return;
    }

    try {
        const loginResponse = await axios.post(
            `${API_URL}/api/login`,
            {
              email: email.toLowerCase(),
              password: password
            }
        );

        if (loginResponse.data.success) {
            toast.success("Login successful! Redirecting...");
            // setUser(loginResponse.data.user);
            sessionStorage.setItem("token",loginResponse.data.token);
            setTimeout(() => {
                navigate("/form");
            }, 1000);
        } else {
            toast.error("Login failed, please check your credentials");
        }
    } catch (error) {
        console.error("Login error:", error.response?.data || error);
        toast.error(
            error.response?.data?.error || 
            "Login failed. Please check your credentials."
        );
    }
  };

  const handleGoogleAuth = async (response) => {
    try {
      const token = response.credential;
      const decoded = jwtDecode(token);
      const user = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      };

      console.log("Google Auth Response:", user); // Debug log

      try {
        const loginResponse = await axios.post(
           `${API_URL}/api/loginAuth`,
          {
            email: user.email,
            password: "google-auth-user"
          }
        );

        if (loginResponse.data.success) {
          setTimeout(() => {
            toast.success("Login successfully")
            
          }, 2000);
          // setUser(user);
          sessionStorage.setItem("token",loginResponse.data.token);
          
          toast.success("Login successful!");
          navigate("/form");
          window.location.reload();
        }
        else {
          toast.error(loginResponse.data.error);

        }
      } catch (error) {
        console.error("Login error:", error.response?.data || error);
        toast.error(
          error.response?.data?.error ||
            "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <ToastContainer/>
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <div className="" style={{
            position: "relative"
          }}>

          <input
            type={showPassword?"text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            />
           <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px",
                color: "#555",
              }} />
              </div>
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
        <p>or</p>
        <GoogleOAuthProvider clientId={clientId}>
          <div className="google">
            <div className="auth">
              <GoogleLogin onSuccess={handleGoogleAuth} onError={() => toast.error("Login Failed")}
              text="continue_with"//note-you cannot type any text, some are fixed with it
              />
            </div>
          </div>
        </GoogleOAuthProvider>
        <div className="register-option">
          Don't have an account? <Link to="/signup">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
