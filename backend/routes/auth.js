const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists!');
        }
        
        // Create new user
        const user = new User({ username, password });
        await user.save();
        
        res.send('User created successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid username or password!');
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send('Invalid username or password!');
        }
        
        res.send('Login success');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error logging in');
    }
});

module.exports = router;