import React, { useState } from "react";
import "./otp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Otp({ email, otpVerification }) {
  const [otpState, setOtpState] = useState("Send Otp");
  const [verificationStatus, setVerificationStatus] = useState(false);
  const [otp, setOtp] = useState("");
  // const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const API_URL = "http://localhost:5000";

  const verifyOTP = () => {
    if (otp.length === 0) {
      toast.error("Please enter the OTP");
      return;
    }
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }
    axios
      .post(`${API_URL}/api/otp/verify-otp`, {
        email: email,
        otp: otp,
      })
      .then((response) => {
        // console.log(response.data);
        toast.success(response.data.message);
        setVerificationStatus(true);
        otpVerification(true);

      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleOtp = async () => {
    if (email.length === 0) {
      toast.error("Please enter your email");
      return;
    }

    await axios
      .post(`${API_URL}/api/otp/send-otp`, {
        email: email,
      })
      .then((response) => {
        // console.log(response.data);
        toast.success(response.data.message);
        setOtpState("resend Otp");
        const hideOtpBox = document.querySelectorAll(".show-otp-button");
        hideOtpBox.forEach((el) => {
          el.style.display = "inline";
        });
      })
      .catch((error) => {
        // console.error("Error sending OTP:", error);
        toast.error("Failed to send OTP. Please try again.");
      });
  };
  return (
    <div>
      <ToastContainer />
      <div className="">
        <input disabled={verificationStatus}
          type="text"
          onChange={(e) => setOtp(e.target.value)}
          value={otp}
          className="show-otp-button"
          placeholder="Enter otp from email"
        />
        <button type="button" disabled={verificationStatus} onClick={verifyOTP} className="show-otp-button">
          {verificationStatus ? "Verified" : "Verify Now"} 
        </button>

        <button disabled={verificationStatus} type="button" onClick={handleOtp} className="otp-button">
          {otpState}
        </button>
      </div>
    </div>
  );
}

export default Otp;


