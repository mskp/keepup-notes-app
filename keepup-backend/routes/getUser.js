const express = require('express');
const mongoose  = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware
const fetchUser = require('../middleware/fetcher');

router.post('/', fetchUser ,async (req, res) => {
    try {
        let userId = req.user.id;
        let user = await User.findById(userId).select('-password');
        return res.json(user);
    } catch (err) {
        return res.status(500).json(err.message);
    }
})

module.exports = router;
