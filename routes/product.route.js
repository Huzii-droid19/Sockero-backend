const express = require('express')
var fs = require('fs')
var { parse } = require('csv-parse')
const getStream = require('get-stream')
const router = express.Router()
const models = require('../models')
const authorize = require('../middleware/userAuthorize')
const jwtGenerator = require('../utils/jwtGenerator')
const bcrypt = require('bcrypt')

router.post('/addProduct', async (req, res) => {
	const { name,description,img,category,m_id } = req.body

	try {
		const item = await models.Product.findAll({
			where: {
				name: name,
			},
		})
		if (item.length > 0) {
			return res.status(401).json({data:item, message: 'Product already exist!' })
		}

		let addItem = await models.Product.create({
			name: name,
            description: description,
            image: img,
            category: category,
            manufacturer_id: m_id
			
		})
        return res.status(200).json({data:addItem, message: 'Product added successfully'})

	} catch (err) {
		console.error(err)
		res.status(500).json({ source: 'Error in adding the Product', message: err.message })
	}
})

router.get("/", async(req, res) => {
	try {
	  const user = await models.Product.findAll();
	  if (user.length < 1) {
		return res.status(401).json({ data: "No data" });
	  }
  
	  return res.status(200).json({ data: user });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({
		source: "Getting products",
		message: err.message,
	  });
	}
  });
router.delete("/delete-product/:product_id",async(req,res)=>{
	console.log(req.params.product_id);
	await models.Product.destroy({
		where:{
		id:req.params.product_id}
	}).then(async p=>{
		if(p){
			const products=await models.Product.findAll();
			res.status(200).json({message:"Product deleted successfully",data:products})
		} else{
			res.status(401).json({message:"Product not found"})
		}
	}).catch(err=>{
		console.error(err)
		res.status(500).json({source:"Error in deleting the Product",message:err.message})
	})
})
module.exports=router;