const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

// Middleware to parse JSON request body
app.use(express.json());

// Enable CORS for Postman testing
app.use(cors());

// Basic security headers
app.use(helmet());

// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// Mock user data 
let users = [
  {
    id: 1,
    username: "adminUser",
    email: "admin@secure.com",
    password: "hashedPassword123", // Simulate hashed password
    role: "admin",
    active: true,
  },
  {
    id: 2,
    username: "regularUser",
    email: "user@secure.com",
    password: "hashedPassword456", // Simulate hashed password
    role: "user",
    active: true,
  },
  {
    id: 3,
    username: "guestUser",
    email: "guest@secure.com",
    password: "hashedPassword789", // Simulate hashed password
    role: "guest",
    active: false,
  }
];

// GET request - Retrieve all users (admin only)
app.get("/", (req, res) => {
  const userRole = req.header("role"); // Simulate role-based authorization

  if (userRole !== "admin") {
    return res.status(403).json({ message: "Forbidden: You don't have access." });
  }

  console.log('GET request received.');
  res.status(200).json(users);
});

// POST request - Update user data (with validation)
app.post("/update", (req, res) => {
  const updates = Array.isArray(req.body) ? req.body : [req.body]; // Normalize input to an array

  const updatedUsers = [];
  const addedUsers = [];

  updates.forEach(update => {
    const { id, username, email, role, active } = update;

    // Validation: Ensure an ID is provided
    if (id === undefined) {
      return res.status(400).json({
        message: "ID is required to add or update a user."
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format."
      });
    }

    // Validate role
    const validRoles = ["admin", "user", "guest"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role provided."
      });
    }

    // Find the user by ID
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex !== -1) {
      // User exists: update their properties
      if (username !== undefined) users[userIndex].username = username;
      if (email !== undefined) users[userIndex].email = email;
      if (role !== undefined) users[userIndex].role = role;
      if (active !== undefined) users[userIndex].active = active;

      updatedUsers.push({ ...users[userIndex] });
    } else {
      // User doesn't exist: add a new user
      const newUser = { id, username, email, role, active };
      users.push(newUser);
      addedUsers.push(newUser);
    }
  });

  res.status(200).json({
    message: "Users processed successfully",
    updatedUsers: updatedUsers.length > 0 ? updatedUsers : undefined,
    addedUsers: addedUsers.length > 0 ? addedUsers : undefined
  });
});

// PUT request to update a single user
app.put("/update/:id", (req, res) => {
  const userId = parseInt(req.params.id); // Extract user ID from URL
  const { username, email, role, active } = req.body;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format."
    });
  }

  // Validate role
  const validRoles = ["admin", "user", "guest"];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid role provided."
    });
  }

  // Find the user by ID
  const user = users.find(user => user.id === userId);

  if (user) {
    // Update user properties if provided
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (active !== undefined) user.active = active;

    res.status(200).json({
      message: "User updated successfully",
      updatedUser: user
    });
  } else {
    res.status(404).json({
      message: "User not found"
    });
  }
});

// DELETE request to remove a user by ID
app.delete("/delete/:id", (req, res) => {
  const userId = parseInt(req.params.id); // Extract user ID from URL

  // Validate userId
  if (isNaN(userId)) {
    return res.status(400).json({
      message: "Invalid user ID."
    });
  }

  // Find the index of the user
  const userIndex = users.findIndex(user => user.id === userId);

  if (userIndex !== -1) {
    // Remove the user from the array
    const deletedUser = users.splice(userIndex, 1);

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: deletedUser[0]
    });
  } else {
    res.status(404).json({
      message: "User not found"
    });
  }
});

// Start server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
