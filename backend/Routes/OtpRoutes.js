const express = require("express");
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");
const otpGenerator = require("otp-generator");

dotenv.config();
const OtpRoutes = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const otpStore = new Map(); // email => { otp, expiry }


// Send OTP to user's email
OtpRoutes.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    alphabets: false,
  });
  const expiry = Date.now() + 5 * 60 * 1000;

  otpStore.set(email, { otp, expiry });

  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Your OTP Code for Email Verification At Enquiry App",
    text: `Your OTP code is ${otp}. It is only valid for 5 minutes.`,
  };

  try {
    await sgMail.send(msg);
    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});


//verify otp
OtpRoutes.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ error: "Email and OTP are required" });

  const record = otpStore.get(email);
  if (!record)
    return res.status(400).json({ error: "No OTP found for this email" });

  if (Date.now() > record.expiry) {
    otpStore.delete(email);
    return res.status(400).json({ error: "OTP expired" });
  }

  if (record.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

  otpStore.delete(email);

  return res.status(200).json({ message: "OTP verified successfully" });
});

module.exports = OtpRoutes;