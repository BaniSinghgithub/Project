const express = require("express"); // import express from express
const { User, Thread } = require("./SchemaMongodb");
const UserRoutes = express.Router();
const jwt=require("jsonwebtoken");

// to get thread data on starting of page
UserRoutes.get("/getthread", async (req, res) => {
  const threads = await Thread.find({});
  res.status(200).json(threads);
  // console.log(threads);
});

// to save thread data
UserRoutes.post("/savethread", async (req, res) => {
  try {
    const { title, content, comments, tags,author, status } = req.body;
    console.log(req.body);
    
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
    console.error("Error saving thread:", error);
    return res.status(500).json({
      status: false,
      error: "Error saving thread data",
    });
  }
});


// to delete thread data
UserRoutes.delete(`/deletethread/:content`, async (req, res) => {
  try{
    const content = req.params.content;
    console.log("content",content);
    const response=await Thread.findOneAndDelete({content});

    if(!response){
      return res.json({
        message:"Thread not found",
        status:false});
      
    }

    console.log("thread deleted successfully")
    res.status(200).json({
      message: "Thread deleted successfully",
      status:true
    });
    
  }
  catch(err){
    console.log("error in deleting thread");
    res.status(500).json({
      message: "Error deleting thread",
      status:false
    })
  }
});

// to update thread data
UserRoutes.put(`/updatethread/:content`, async (req, res) => {
  try{
    const { comment } = req.body;
    const { content } = req.params;

    console.log(comment,content);

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
  
    console.log("thread found and updated successfully");
    res.status(200).json({
      message: "Thread updated successfully",
      status:true
    });
  }
  catch(err){
    console.log("error in updating thread");
    res.status(500).json({
      message: "Error updating thread",
      status:false
    });
  }
});

// Register new user
UserRoutes.post("/register", async (req, res) => {
  try {
    const { name, email, password, isGoogleAuth } = req.body;

    // console.log("Registration attempt for:", { name, email, isGoogleAuth }); // Debug log

    if ((!name || !email || !password) && !isGoogleAuth) {
      return res
        .status(400)
        .json({ error: "Name, email and password are required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    // Debug log
    console.log("User found:", user ? "Yes" : "No");
    if (user) {
      return res.json({
        status: false,
        message:
          "email id is already registered, try another email id or login",
      });
    }

    // Create new user
    const newUser = new User({
      name: name,
      email: email.toLowerCase(),
      password: isGoogleAuth ? "google-auth-user" : password, // Handle Google users differently
      isGoogleAuth: isGoogleAuth,
    });

    await newUser.save();
    console.log("User registered successfully:"); // Debug log

    return res.status(201).json({
      status: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Error registering user",
    });
  }
});

// Check if email is registered
UserRoutes.post("/verifyToken", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(403).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
              status:false,
              message: "Unauthorized acess" });
        }
      return res.status(200).json({ status:true, message: "Token is valid" });
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      status:false,
      message: "Internal Server Error" });
  }
});

// Login route by email password
UserRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Debug log
    console.log("Attempting to find user with email:", email);

    // Find user by email
    const user = await User.findOne({
      email,password
    });

    // Debug log
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User email id not found",
      });
    }

    const token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:"1d"});


    // Return user data (excluding password)
    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        isGoogleAuth: user.isGoogleAuth,
      },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Login route by google auth
UserRoutes.post("/loginAuth", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Debug log
    console.log("Attempting to find user with email:", email);

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    // Debug log
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User email id not found, please register first",
      });
    }

    const token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:"1d"});

    // Return user data (excluding password)
    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        isGoogleAuth: user.isGoogleAuth,
      },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
});

module.exports = UserRoutes;
