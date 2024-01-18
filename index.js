const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postsRoute = require("./routes/posts");
const catRoute = require("./routes/category");
const userDetailRoute = require("./util/getUser")
const SubscriberRoute = require("./routes/subscribe")
const multer = require("multer")
const cookieParser = require('cookie-parser');
const path = require("path");
const PORT = process.env.PORT || 8000


dotenv.config();
app.use(express.json())
app.use("/Images", express.static(path.join(__dirname, "/Images")))
mongoose.connect(process.env.MONGO_URL)
.then(console.log("Connected to MongoDB"))
.catch((err) => console.log(err));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Images'); 
      },
      filename: function (req, file, cb) {
        //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        //file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()
        cb(null, req.body.name);
      }
})
const upload = multer({storage: storage, limits: {
  fieldNameSize: 100, // Adjust the maximum field name size
  fieldSize: 1024 * 1024 * 10, // Adjust the maximum field data size (e.g., 5MB)
},});

app.post("/blog/upload", upload.single("img"), (req, res) => {
  //const imagePath = path.join("../../../../backend/Images", req.file.filename);
  res.status(200).json("File uploaded successfully");
})

app.use("/blog/auth", authRoute) 
app.use("/blog/user", userRoute) 
app.use("/blog/posts", postsRoute) 
app.use("/blog/category", catRoute) 
app.use("/blog/api", userDetailRoute) 
app.use("/blog/subscribe", SubscriberRoute)


app.use(cookieParser());

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "https://blog-diaries.netlify.app/");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.use(allowCrossDomain);



app.listen(PORT, () => {
    console.log("Server is running");
})
