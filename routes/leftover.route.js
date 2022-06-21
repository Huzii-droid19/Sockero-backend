const express = require('express')
var fs = require('fs')
var { parse } = require('csv-parse')
const getStream = require('get-stream')
const router = express.Router()
const models = require('../models')
const authorize = require('../middleware/userAuthorize')
const jwtGenerator = require('../utils/jwtGenerator')
const bcrypt = require('bcrypt')

router.post('/addLeftover', async (req, res) => {
	const { name,description,quantity,price,duration,img,category,m_id } = req.body

	try {
		const item = await models.Leftover.findAll({
			where: {
				name: name,
			},
		})
		if (item.length > 0) {
			return res.status(401).json({data:item, message: 'Leftover already listed!' })
		}

		let addItem = await models.Leftover.create({
			name: name,
            description: description,
            quantity: quantity,
            price: price,
            duration: duration,
            image: img,
            category: category,
            manufacturer_id: m_id
			
		})
        return res.status(200).json({data:addItem, message: 'Leftover listed successfully'})

	} catch (err) {
		console.error(err)
		res.status(500).json({ source: 'Error in listing', message: err.message })
	}
})
module.exports=router;