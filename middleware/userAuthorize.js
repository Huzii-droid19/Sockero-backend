const jwt = require('jsonwebtoken')
require('dotenv').config()

//this middleware will continue on if the token is inside the local storage

module.exports = function (req, res, next) {
	// Get token from header
	const token = req.header('user_jwt_token')

	// Check if not token
	if (!token) {
		return res.status(403).json({ msg: 'authorization denied' })
	}

	// Verify token
	try {
		//it is going to give use the user id (user:{id: user.id})
		const verify = jwt.verify(token, 'c265b15f-6817-4d0b-b62d-29d72c174904')

		req.customer = verify.customer
		next()
	} catch (err) {
		res.status(401).json({ msg: 'Token is not valid' })
	}
}
