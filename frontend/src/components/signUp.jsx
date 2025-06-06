import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signUp.css";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Otp from "./otp";

export default function SignUp() {
  const navigate = useNavigate();
  // const [data, setdata] = useState(null); // for localstorage
  const [showPassword, setShowPassword] = useState(false);
  const [showconfPassword, setShowconfPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL=process.env.REACT_APP_API_URL || "http://localhost:5000";
  // const API_URL = "http://localhost:5000";
  const [formData, setFormData] = useState({
    // for form data
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otpVerified, setOtpVerified] = useState(false);
  const handleOtpVerified = (status) => {
    setOtpVerified(status);
  };

 const clientId =process.env.REACT_APP_GOOGLE_CLIENT_ID;

  // useEffect(() => {
  //   toast("Please fill in all required fields");
  // }, []);

  useEffect(() => {
      const user = sessionStorage.getItem("token");
      if (user) {
        // setUser(user);
        navigate("/form");
      }
    }, []);

  const handleGoogleAuth = async (response) => {
    setIsLoading(true);
    try {
      const token = response.credential;
      
      // If new user, register
      const registerResponse = await axios.post(
        `${API_URL}/api/registerAuth`,
       {token: token}
      );

      if (registerResponse.data.status) {
        sessionStorage.setItem("token", registerResponse.data.token);
        sessionStorage.setItem("user", JSON.stringify(registerResponse.data.user.name));
        // setdata(JSON.parse(localStorage.getItem("user")));
        setTimeout(() => {
          toast.success("Registration successful!");
        }, 2000);
        navigate("/form");
        window.location.reload();
      } else {
        setTimeout(() => {
          toast.error(registerResponse.data.message);
        }, 1000);
      }
    } catch (error) {
      // console.error("Google Auth Error:", error.response?.data || error);
      toast.error(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  //register by email and password
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      toast.error("Please verify your email with OTP before signing up");
      return;
    }
    setIsLoading(true);

    // console.log("submited");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    // console.log("all fields are filled");

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const registerResponse = await axios.post(
        `${API_URL}/api/register`,
        {
          name: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      // console.log("data sent for registration");

      if (!registerResponse.data.status) {
        setTimeout(() => toast.error(registerResponse.data.message), 2000);
      } else {
        sessionStorage.setItem("token", registerResponse.data.token);
        sessionStorage.setItem("user",formData.username);
        setTimeout(() => {
          toast.success(registerResponse.data.message);
        }, 2000);
        navigate("/login");
      }
    } catch (error) {
      // console.error("Registration error:", error);
      toast.error(
        error.response?.data?.error || "Registration failed check credentials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup">
      <ToastContainer />
      <div className="form">
        <h1>Register Now</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            disabled={isLoading}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
            }}
            disabled={isLoading}
            required
            className=""
          />
          <div
            className=""
            style={{
              position: "relative",
            }}
          >
            <input
              // type="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={isLoading}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "50%",
                right: "13%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px",
                color: "#555",
              }}
            />
          </div>
          <div
            className=""
            style={{
              position: "relative",
            }}
          >
            <input
              // type="password"
              type={showconfPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              disabled={isLoading}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              onClick={() => setShowconfPassword(!showconfPassword)}
              style={{
                position: "absolute",
                top: "50%",
                right: "13%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px",
                color: "#555",
              }}
            />
          </div>
          {/* add button to send otp on mail id */}
          <Otp email={formData.email} otpVerification={handleOtpVerified} />
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <p>or</p>
        <GoogleOAuthProvider clientId={clientId}>
          <div className="google">
            <div className="auth">
              <GoogleLogin
                onSuccess={handleGoogleAuth}
                onError={() => {
                  // console.error("Google login failed");
                  toast.error("Google sign-up failed");
                }}
                disabled={isLoading}
                useOneTap
                cookiePolicy="single_host_origin"
              />
            </div>
          </div>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}
