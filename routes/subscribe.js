const router = require("express").Router();
const Subscriber = require("../models/Subscriber");
const sendThanksEmail = require("../communications/confirmationEmail")
const sendDailyEmails= require("../communications/subscribedEmail")
router.post("/", async (req, res) => {
    try {
        const existingEmail = await Subscriber.findOne({email: req.body.email});
        if(existingEmail) {
            return res.status(200).json("Email already registered");
        }
        const subscriber_email = Subscriber({
            email: req.body.email
        })
        const subscribed = await subscriber_email.save();
        sendThanksEmail(req.body.email);
        return res.status(200).json({ message: 'Subscription successful' });
  } catch (err){
        return res.status(500).json({ message: 'Error subscribing. Please try again.' });
    }
})



module.exports = router