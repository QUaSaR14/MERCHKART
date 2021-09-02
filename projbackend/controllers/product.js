const Product = require('../models/product')
const product = require('../models/product')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')

// Param Extractor
exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")
        .exec((err, product) => {
        if(err) {
            return res.status(400).json({
                error : "Product not found :("
            })
        }
        req.product = product
        next()
    })
}

// Callbacks
exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error : "Problem with Image"
            })
        }

        // Destructure the fields
        const { name, description, price, category, stock } = fields

        // Validate the fields
        if(
            !name ||
            !description || 
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error : "Please include all fields :|"
            })
        }

        let product = new Product(fields)

        // Handle file here
        if(file.photo) {
            if(file.photo.size > 4000000){
                return res.status(400).json({
                    error : "File size too big !!"
                })
            }
            // Fill photo fields of product
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        // console.log(product)

        // Save to DB
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error : "Saving product in DB failed"
                })
            }
            res.status(200).json(product)
        })
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    res.status(200).json(req.product)
}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error : "Problem with Image"
            })
        }

        // Updation Code
        let product = req.product
        // Shallowly copy all of the properties 
        // in the source objects over to the destination object, 
        // and return the destination object
        product = _.extend(product, fields)

        // Handle file here
        if(file.photo) {
            if(file.photo.size > 4000000){
                return res.status(400).json({
                    error : "File size too big !!"
                })
            }
            // Fill photo fields of product
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        // console.log(product)

        // Save to DB
        product.save((err, product) => {
            if(err){
                return res.status(400).json({
                    error : "Updation of product failed :/"
                })
            }
            res.status(200).json(product)
        })
    })
    
}

exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to delete the product :("
        });
      }
      res.json({
        message: `${deletedProduct.name} deleted successfully :)`,
        deletedProduct
      });
    });
  };

exports.getAllProducts = (req, res) => {
    let limit = (req.query.limit) ? parseInt(req.query.limit) : 5
    let sortBy = (req.query.sortBy) ? req.query.sortBy : "_id"
    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[ sortBy, "asc" ]])
        .limit(limit)
        .exec((err, products) => {
            if(err) {
                return res.status(400).json({
                    error : "No products FOUND :( "
                })
            }
            res.status(200).json(products)
        })
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err) {
            return res.status(400).json({
                error : "No category found :<"
            })
        }
        res.status(200).json(category)
    })
}

// Middleware
// For optimization purpose
exports.photo = (req, res, next) => {
    if(req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        // console.log(req.product.photo)
        return res.status(200).send(req.product.photo.data)
    }
    next()
}

// updates the product inventory
exports.updateStock = (req, res, next) => {

    let bulkOps = req.body.order.products.map((product, index) => {
        return {
            updateOne : {
                filter : { _id : product._id },
                update : { $inc : { stock : -product.count , sold : +product.count } }
            }
        }
    })

    Product.bulkWrite(bulkOps, {}, (err, products) => {
        if(err) {
            return res.status(400).json({
                error : "Bulk Operation failed :( "
            })
        }
        next()
    })
}

