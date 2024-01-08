const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const { createSecretToken } = require("../util/SecretToken");

//Register
router.post("/register", async (req, res) => {
    try {
       
            const existingUser = await User.findOne({username: req.body.username});
            const existingUserEmail = await User.findOne({email: req.body.email});
            if(existingUser) {
                return res.status(200).json("Username not available");
            }
            if(existingUserEmail) {
                return res.status(200).json("Email already registered");
            }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        const user = await newUser.save();
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
        });
        return res.status(200).json("Success");
    } catch(err) {
        res.status(500).json(err);
    }
})


//Login

router.post("/login", async (req, res) => {
    try {
        //const salt = await bcrypt.genSalt(10);
        //const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = await User.findOne({ $or: [{ username: req.body.identifier }, { email: req.body.identifier }] });
        if(!user) {
            return res.status(200).json("Wrong credentials");
        } 
        const validated = await bcrypt.compare(req.body.password, user.password);
        if(!validated) {
            return res.status(200).json("Wrong credentials");
        } 

        const token = createSecretToken(user._id);
        res.cookie("token", token, {
           httpOnly: true,
       });
        return res.status(200).json("Success");
    } catch(err) {
        res.status(500).json(err);
    }
})

/// Logout 

router.post('/logout', (req, res) => {
    res.clearCookie('token').json({ message: 'Logout successful.' });
});



module.exports = router


