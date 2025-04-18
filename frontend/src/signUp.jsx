import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signUp.css";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function SignUp() {
  const navigate = useNavigate();
  // const [data, setdata] = useState(null); // for localstorage
  const [showPassword, setShowPassword] = useState(false);
  const [showconfPassword, setShowconfPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL=process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [formData, setFormData] = useState({
    // for form data
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [emailStatus, setEmailStatus] = useState({
    checked: false,
    exists: false,
  });

 const clientId =process.env.REACT_APP_GOOGLE_CLIENT_ID;

  // useEffect(() => {
  //   toast("Please fill in all required fields");
  // }, []);

  useEffect(() => {
      const user = JSON.parse(sessionStorage.getItem("token"));
      if (user) {
        // setUser(user);
        navigate("/form");
      }
    }, []);

  // useEffect(() => {
  //   if (data) {
  //     navigate("/form");
  //   }
  // }, []);

  // Function to check email availability
  const checkEmailAvailability = async (email) => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      const response = await axios.get(
        `{API_URL}/check-email?email=${email}`
      );

      setEmailStatus({
        exists: response.data.exists,
        checked: true,
      });

      if (response.data.exists) {
        toast.error("Email already registered");
      }
      //  else {
      //   toast.success("Email available");
      // }
    } catch (error) {
      console.error("Email check error:", error);
      // toast.error("Error checking email availability");
    }
  };

  // Debounced email check    // directly used on onchange
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     if (formData.email) {
  //       checkEmailAvailability(formData.email);
  //     }
  //   }, 500); // Wait 500ms after user stops typing
  //   if(emailStatus.exists){
  //     toast.error("Email already registered, try another one");
  //   }

  //   return () => clearTimeout(timeoutId);

  // }, [formData]);

  const handleGoogleAuth = async (response) => {
    setIsLoading(true);
    try {
      const token = response.credential;
      const decoded = jwtDecode(token);
      const userData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      };
      console.log("Google Auth Response:", userData);

      // Check if user exists
      // const checkUserResponse = await axios.get(
      //   `http://localhost:5000/api/userRoutes/check-email/${userData.email}`
      // );

      // await checkEmailAvailability(userData.email);
      // if (emailStatus.exists){
      //   toast.error("Email already registered, Please login instead.");
      //   setTimeout(() => navigate("/login"), 2000);
      //   return;
      // }

      // If user not exist, register
      const registerResponse = await axios.post(
        `${API_URL}/api/userRoutes/register`,
        {
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
          isGoogleAuth: true,
        }
      );

      if (registerResponse.data.status) {
        sessionStorage.setItem("token",loginResponse.data.token);
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
      console.error("Google Auth Error:", error.response?.data || error);
      toast.error(
        error.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("submited");

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
        `${API_URL}/api/userRoutes/register`,
        {
          name: formData.username,
          email: formData.email,
          password: formData.password,
          isGoogleAuth: false,
        }
      );

      // console.log("data sent for registration");

      if (!registerResponse.data.status) {
        setTimeout(() => toast.success(registerResponse.data.message), 2000);
      } else {
        setTimeout(() => {
          toast.success(registerResponse.data.message);
        }, 2000);
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
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
              checkEmailAvailability(e.target.value);
            }}
            disabled={isLoading}
            required
            className={
              emailStatus.checked
                ? emailStatus.exists
                  ? "email-exists"
                  : "email-available"
                : ""
            }
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
          <button type="submit" disabled={isLoading || emailStatus.exists}>
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
                  console.error("Google login failed");
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
