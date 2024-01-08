const router = require("express").Router();
const Category = require("../models/Category");


//Create Category
router.post("/", async (req, res) => {
    const categoryName = req.body.name;
    try {
        // Check if the category already exists
        const existingCategory = await Category.findOne({ name: categoryName });
    
        if (existingCategory) {
          return res.status(409).json({ message: 'Category already exists.' });
        }
    
        // Create a new category
        const newCategory = new Category({ name: categoryName });
    
        // Save the new category to the database
        await newCategory.save();
    
        return res.status(201).json({ message: 'Category created successfully.' });
      } catch (error) {
        return res.status(500).json({ message: 'Error creating category.', error });
      }
})


//Get all Category
router.get("/", async (req, res) => {
    
    try {
        const cats = await Category.find();
        res.status(200).json(cats);

    } catch(err) {
        res.status(500).json(err);
    }
})
module.exports = router