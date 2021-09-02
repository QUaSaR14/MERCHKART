const Category = require('../models/category')
const category = require('../models/category')

// Param Extractor Method
exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err){
            return res.status(400).json({
                error : "Category not found :/"
            })
        }

        req.category = category
        next()
    })
}

// Callbacks
exports.createCategory = (req, res) => {
    const category = new Category(req.body)
    category.save((err, category) => {
        if(err){
            return res.status(400).json({
                error : "Unable to save category in DB :<"
            })
        }
        res.status(200).json({ category })
    })
}

exports.getCategory = (req, res) =>{
    return res.status(200).json(req.category)
}

exports.getAllCategory = (req, res) =>{
    
    Category.find().exec((err, categories) => {
        if(err) {
            return res.status(400).json({
                error : "No categories found :( "
            })
        }
        res.status(200).json(categories)
    })
}

exports.updateCategory = (req, res) => {
    const category = req.category
    category.name = req.body.name

    category.save((err, updatedCategory) => {
        if(err) {
            return res.status(400).json({
                error : "Failed to update category :|"
            })
        }
        res.status(200).json(updatedCategory)
    })
}

exports.removeCategory = (req, res) => {
    const category = req.category
    category.remove((err, deletedCategory) => {
        if(err) {
            return res.status(400).json({
                error : "Failed to delete this category :/"
            })
        }
        res.status(200).json({
            message : `${deletedCategory.name} successfully deleted :)`
        })
    })

}