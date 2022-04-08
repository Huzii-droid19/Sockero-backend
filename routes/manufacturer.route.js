const express = require('express')
var fs = require('fs')
var { parse } = require('csv-parse')
const getStream = require('get-stream')
const router = express.Router()
const models = require('../models')
const authorize = require('../middleware/userAuthorize')
const jwtGenerator = require('../utils/jwtGenerator')
const bcrypt = require('bcrypt')

router.post('/register', async (req, res) => {
	const { email, name, password, address, city, ntn,CNIC } = req.body

	try {
		const user = await models.Manufacturer.findAll({
			where: {
				email: email,
			},
		})
		if (user.length > 0) {
			return res.status(401).json({ data: 'Manufacturer already exist!' })
		}

		const salt = await bcrypt.genSalt(9)
		const bcryptPassword = await bcrypt.hash(password, salt)

		let addUser = await models.Manufacturer.create({
			name: name,
			email: email,
			password: bcryptPassword,
			address: address,
			city: city,
			ntn: ntn,
      CNIC:CNIC,
      isApproved:false
		})

		const userJWTToken = jwtGenerator(addUser.id)

		return res.json({ token: userJWTToken, data: addUser })
	} catch (err) {
		console.error(err)
		res.status(500).json({ source: 'Error in registering the Manufacturer', message: err.message })
	}
})

router.post("/signin",async (req,res)=>{
    const { email,password } = req.body;

    await models.Manufacturer.findOne({
        where:{
            email:email
        }
    }).then((manufacturer)=>{
        if(manufacturer){
            const isMatch = bcrypt.compareSync(password,manufacturer.password);
            if(isMatch){
                const token = jwtGenerator(manufacturer.id);
                return res.status(200).json({status:true,token:token,user:manufacturer});
            }
            else{
                return res.status(401).json({status:false,message:"Invalid Password"});

            }
        } else{
            return res.status(404).json({status:false,data:"User not found"})
        }
    }).catch((err)=>{
        console.log(err);
        return res.status(500).json({source:"Error in finding the user",message:err.message});
    })

})

router.get('/list', authorize, async (req, res) => {
	try {
		const manufacturerData = await models.Manufacturer.findAll({
			where: {
				isApproved: false,
			},
		})

		return res.status(200).json({ data: manufacturerData })
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ source: 'Error in user verification', message: err.message })
	}
})

router.post('/update/status/by/:id', authorize, async (req, res) => {
	try {
		const id = req.params.id
		const { status } = req.body
		const data = await models.Manufacturer.update(
			{
				isApproved: status,
			},
			{
				where: {
					id: id,
				},
			}
		)
		return res.status(200).json({ data: data })
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ source: 'Error in approval', message: err.message })
	}
})

router.get('/verify/by/ntn/:id', authorize, async (req, res) => {
	try {
		const id = req.params.id
		console.log(id)

		readCSVData = async (filePath) => {
			const parseStream = parse({ delimiter: ',' })
			const data = await getStream.array(fs.createReadStream(filePath).pipe(parseStream))
			return data.map((line) => {
				if (line[0] == id) {
					console.log(true)
					return res.status(200).json({ approved: true })
				}
			})
		}

		const data = await readCSVData(`${__dirname}/ATL.csv`)
	} catch (err) {
		console.error(err.message)
		res.status(500).json({ source: 'Error in verifying details', message: err.message })
	}
})
module.exports=router;
