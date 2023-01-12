const jwt = require('jsonwebtoken');

'kjf4r87@kjkfbsfjbdjv';

function fetchUser(req, res, next) {
    let token = req.header('auth-token');
    if (!token)
        res.status(401).json({ message: "Invalid auth token" });
    try {
        let data = jwt.verify(token, 'kjf4r87@kjkfbsfjbdjv');
        req.user = data.user;
        next()
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}

module.exports = fetchUser;