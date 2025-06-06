const express = require("express"); // import express from express
const { User, Thread } = require("./SchemaMongodb");
const UserRoutes = express.Router();
const jwt=require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10; 
const authMiddleware = require('./middleware/middleware');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


/* What is saltRounds in bcrypt?

saltRounds determines how many times bcrypt will process the data internally to produce the hash.

Higher rounds = more secure but also slower.

🔢 Explanation
10 is a good default and is used widely in production.
It means: 2¹⁰ = 1024 iterations internally.

The higher the number:
⏳ The longer it takes to hash a password.
🔒 The harder it is to brute-force the hash.
*/

// to get thread data on starting of page
UserRoutes.get("/getthread", authMiddleware, async (req, res) => {
  const threads = await Thread.find({});
  res.status(200).json(threads);
  // console.log(threads);
});

// to save thread data
UserRoutes.post("/savethread", authMiddleware, async (req, res) => {
  try {
    const { title, content, comments, tags,author, status } = req.body;
    // console.log(req.body);
    
    const newThread = new Thread({
      title,
      content,
      // author,
      comments: comments || [], // Default to empty array if undefined
      tags: tags || [],         // Default to empty array if undefined
      status,
      // author
    });
    
    const savedThread = await newThread.save(); // Save and store the result
    
    return res.status(201).json({
      status: true,
      message: "Thread saved successfully!",
      thread: savedThread, // Corrected variable
    });
  } catch (error) {
    // console.error("Error saving thread:", error);
    return res.status(500).json({
      status: false,
      error: "Error saving thread data",
    });
  }
});


// to delete thread data
UserRoutes.delete(`/deletethread/:content`, authMiddleware, async (req, res) => {
  try{
    const content = req.params.content;
    // console.log("content",content);
    const response=await Thread.findOneAndDelete({content});

    if(!response){
      return res.json({
        message:"Thread not found",
        status:false});
      
    }

    // console.log("thread deleted successfully")
    res.status(200).json({
      message: "Thread deleted successfully",
      status:true
    });
    
  }
  catch(err){
    // console.log("error in deleting thread");
    res.status(500).json({
      message: "Error deleting thread",
      status:false
    })
  }
});

// to update thread data
UserRoutes.put(`/updatethread/:content`, authMiddleware, async (req, res) => {
  try{
    const { comment } = req.body;
    const { content } = req.params;

    // console.log(comment,content);

    const response=await Thread.findOneAndUpdate({content:content},
      {
      $push: { comments: { content: comment, createdAt: new Date() } }
    },
    { new: true }  // Returns the updated thread);
  );

  if(!response){
    return res.status(404).json({
      message:"Thread not found",
      status:false
    });
  }
  
    // console.log("thread found and updated successfully");
    res.status(200).json({
      message: "Thread updated successfully",
      status:true
    });
  }
  catch(err){
    // console.log("error in updating thread");
    res.status(500).json({
      message: "Error updating thread",
      status:false
    });
  }
});

// Register new user by email and password
UserRoutes.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // console.log("Registration attempt for:", { name, email, isGoogleAuth }); // Debug log

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    // Debug log
    // console.log("User found:", user ? "Yes" : "No");
    if (user) {
      return res.json({
        status: false,
        message:
          "email id is already registered, try another email id or login",
      });
    }


    // Create new user

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name: name,
      email: email.toLowerCase(),
      password:hashedPassword 
    });

    await newUser.save();
    // console.log("User registered successfully:"); // Debug log

    // Generate JWT Token
    const jwtToken = jwt.sign(
      { email: newUser.email }, // payload
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // token options
    );

    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      token: jwtToken,
    });
  } catch (error) {
    // console.error("Registration error:", error);
    return res.status(500).json({
      message: "Error registering user",
    });
  }
});

// Register new user by google auth
UserRoutes.post("/registerAuth", async (req, res) => {
  const { token } = req.body;

  try {
    // 1. Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); // this is your decoded GAuth payload
    const { sub, email, name, picture } = payload;

    // 2. Check if user already exists
    let user = await User.findOne({ email });

    if(user){
      return res.status(200).json({
        status: false,
        message: "User already exists, please login",
      });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash("google-auth-user", saltRounds);

    if (!user) {
      // 3. Signup if new user
      user = new User({
        name,
        email,
        password:hashedPassword, // Used a default password
      });
      await user.save();
    }

    // 4. Generate JWT Token
    const jwtToken = jwt.sign(
      {email: user.email }, // payload
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // token options
    );

    res.status(200).json({
      status:true,
      message: 'Registration successful',
      token: jwtToken,
      user:{
        name: user.name
      } 
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid Google token', error: err.message });
  }
});


// Login route by email password
UserRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Debug log
    // console.log("Attempting to find user with email:", email);

    // Find user by email
    const user = await User.findOne({
      email
    });


    if(user){
      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: "password is incorrect",
        });
      }
    }

    // Debug log
    // console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User email id is incorrect",
      });
    }

    const token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:"1d"});


    // Return user data (excluding password)
    return res.status(200).json({
      success: true,
      user:{
        name:user.name
      },
      token
    });
  } catch (error) {
    // console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Login route by google auth
UserRoutes.post("/loginAuth", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // 2. Check if user already exists
    let user= await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User email id not found, please register first",
      });
    }

    const jwtToken=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:"1d"});

    // Return user data (excluding password)
    return res.status(200).json({
      success: true,
      user: {
        name: user.name
      },
      token:jwtToken
    });
  } catch (error) {
    // console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
});

module.exports = UserRoutes;