const jwt = require('jsonwebtoken')
require('dotenv').config()

function jwtGenerator(id) {
	const payload = {
		customer: {
			id: id,
		},
	}

	return jwt.sign(payload, 'c265b15f-6817-4d0b-b62d-29d72c174904', { expiresIn: '1h' })
}

module.exports = jwtGenerator
