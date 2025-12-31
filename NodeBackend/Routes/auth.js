const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Function to generate unique role-based ID
const generateRoleId = async (role) => {
  const rolePrefixes = {
    'Farmer': 'f',
    'Resource Provider': 'rp',
    'Retailer': 'r',
    'Wholesaler': 'w',
    'Dealer': 'd',
    'Agriculture Expert': 'ae',
    'Government Agencies': 'ga',
    'NGOs': 'ngo',
    'Admin': 'admin'
  };

  const prefix = rolePrefixes[role] || 'u';
  
  // Find the highest existing number for this role
  const existingUsers = await User.find({ role })
    .sort({ roleId: -1 })
    .limit(1)
    .lean();
  
  if (existingUsers.length === 0) {
    return `${prefix}1`;
  }
  
  const lastUser = existingUsers[0];
  if (!lastUser.roleId) {
    return `${prefix}1`;
  }

  const lastNumber = parseInt(lastUser.roleId.replace(prefix, '')) || 0;
  return `${prefix}${lastNumber + 1}`;
};

// Register user with plain password (not secure)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // If user doesn't have a roleId, generate one
    if (!user.roleId) {
      try {
        const roleId = await generateRoleId(user.role);
        user.roleId = roleId;
        await user.save();
        console.log(`Generated roleId ${roleId} for user ${user.email}`);
      } catch (error) {
        console.error('Error generating roleId:', error);
        // Continue login process even if roleId generation fails
      }
    }

    // If we get here, user exists and password matches
    // Return user data including role and roleId
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        roleId: user.roleId || null
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Signup route
router.post('/signup', async (req, res) => {
    const { email, password, role } = req.body;
    console.log('Signup attempt:', { email, role });
  
    // Basic validation
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Check if email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      // Generate unique role-based ID
      const roleId = await generateRoleId(role);
      console.log(`Generated roleId ${roleId} for new user ${email}`);
  
      // Create new user (password in plain text - not secure)
      const newUser = new User({ email, password, role, roleId });
      await newUser.save();
  
      res.status(201).json({ 
        message: 'Signup successful', 
        user: { 
          email, 
          role, 
          roleId 
        } 
      });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
