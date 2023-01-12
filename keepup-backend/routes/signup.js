const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

router.post(
    '/',
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
    , async (req, res) => {
        // If errors are encountered, return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        try {
            // Checking if user already exists
            let user = await User.findOne({ email: req.body.email });
            if (user)
                return res.status(400).json({ message: "User already exists" })

            // Password being hashed
            let salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash(req.body.password, salt);

            // Inserting the records into database
            user = await User.create({ ...req.body, password: hashedPassword })
            res.status(200).json({ message: `Account created with email ${user.email}` })

        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    })

module.exports = router;