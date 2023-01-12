const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

router.post(
    '/',
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
    , async (req, res) => {
        // If errors are encountered, return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        try {
            let { email, password } = req.body;
            let user = await User.findOne({ email });
            if (!user)
                return res.status(400).json({ message: 'User does not exist' });

            let isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword)
                return res.status(400).json({ message: 'Email and Password do not match' });

            let data = {
                user: {
                    id: user.id
                }
            }
            let authToken = jwt.sign(data, 'kjf4r87@kjkfbsfjbdjv')
            return res.json({ authToken }).status(200);

        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    })

module.exports = router;