const router = require("express").Router();
const Post = require("../models/Posts");



//Create Post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);

    } catch(err) {
        res.status(500).json(err);
    }
})

//Update Post
router.put("/:id", async (req, res) => {
    try {
        const posts = await Post.findById(req.params.id);
        if(posts.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
                    $set:req.body,
                }, {new: true})
                
                res.status(200).json(updatedPost);
            } catch(err) {
                res.status(500).json(err);
            }
        } else {
            res.status(401).json("You can update only your post");
        }
    } catch(err) {
        res.status(500).json(err);
    }
})

//Delete Post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
            try {
                await Post.findByIdAndDelete(req.params.id);
                res.status(200).json("Post has been deleted");
            } catch(err) {
                res.status(500).json(err);
            }
        
    } catch(err) {
        res.status(500).json(err);
    }
})
//Get Post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(post) {
            res.status(200).json(post);
        } 
    } catch(err) {
        res.status(500).json(err);
    }
})

//Get All Posts or using username and Category
router.get("/", async (req, res) => {
    const user = req.query.user;
    const category = req.query.cat;
    const search = req.query.search;
    
    try {
        let posts;
        if(search === undefined && user === undefined && category === undefined) {
            posts = await Post.find();
            
        } else if(user !== undefined && category === undefined) {
            posts = await Post.find({username: user});
            
        } else if(category !== undefined && user === undefined) {
            posts = await Post.find({category: category});
            
        } else if(search !== undefined && user === undefined && category === undefined) {
            posts = await Post.find({
                $or: [
                  { title: { $regex: search, $options: 'i' } },
                  { description: { $regex: search, $options: 'i' } },
                ],
              });
        } else { 
            posts = await Post.find({username: user, category: category});
            
        }
        
        res.status(200).json(posts);
    } catch(err) {
        res.status(500).json(err);
    }
})



module.exports = router
