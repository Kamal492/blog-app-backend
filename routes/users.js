const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const authMiddleware = require("../util/authMiddleware")
//Get account details
router.get("/user_info", authMiddleware, async (req, res) => {
    //console.log(req.headers.cookie);
    try {
        const user = req.user;
        if(user) {
            try {
                const userInfo = await User.findOne({_id: user});
                res.status(200).json({user:userInfo, message:"Success"})
            } catch (err){
                res.status(500).json(err);
            }
        
        } else {
            res.status(401).json({user: null, message:"Unauthorized access"})
        }
    } catch (error) {
        res.status(500).json( {user: null, message: 'Error retrieving user information' });
    }
})
//Update account
router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                profilePic: req.body.photo, bio: req.body.bio, about: req.body.about,
            }, {new: true})
            
            res.status(200).json(updatedUser);
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(401).json("You can update only your account");
    }
})

//Delete account
router.delete("/:id", async (req, res) => {
    
        try {
            const user = await User.findById(req.params.id);
            try {
                await User.findByIdAndDelete(req.params.id)
                res.clearCookie('token').json({ message: 'Logout successful.' });
                res.status(200).json("Your account has been deleted");
            } catch(err) {
                res.status(500).json(err);
            }
        } catch(err) {
            res.status(404).json("User not found!")
        }
        
   
})

module.exports = router
