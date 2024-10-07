const express = require("express");
const dotenv = require("dotenv").config()
// dotenv.config();
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const gymRoutes = require("./routes/gym");
const reclamationRoutes = require("./routes/reclamation");

const authRoutes = require("./routes/auth");
const passwordResetRoutes = require("./routes/passwordReset");
const path = require("path");
const cookieParser=require('cookie-parser');
const session= require('express-session');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const coachingRoutes = require("./routes/coachings"); // import products router
const reservationcRoutes = require("./routes/reservationcs"); // import products router

const productRoutes = require("./routes/products"); // 
const cartRoutes = require("./routes/Cart"); // 
const blogRoutes = require("./routes/blog"); // 
const comment = require("./routes/comment")


const twilio = require('twilio');





// Définir le chemin pour les fichiers statiques, y compris les images




const db=process.env.DBURL


// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

app.use(cookieParser());

app.use(session({
    secret:'my-secret-key',
    resave:false,
    saveUninitialized:true
}));


// routes
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passwordResetRoutes);
// Route to display users
// Route to display users
app.get("/api/users", userRoutes.get);

// Route to delete a user
app.delete("/api/users/:id", userRoutes.delete);
// Route to block a user
app.put("/api/users/:id/block", userRoutes.put);
//jawher routes
app.use("/api/coachings", coachingRoutes); // use products router
app.use('/uploads', express.static('uploads'));
app.use("/api/reservations", reservationcRoutes); // use products router
//end jawher routes

//chedi routes
app.use("/api/products", productRoutes); // use products router
app.use("/api/cart", cartRoutes); // use products router 
app.get("/api/blog/recent", blogRoutes.get); // use products router 

app.use("/api/blog", blogRoutes); // use products router 


app.use("/api/commentaire", comment); // use products router 

//chedi routes fin


app.use("/api/gyms",gymRoutes);
app.use("/api/reclamations",reclamationRoutes);



const port = process.env.PORT || 5000;
/** POST: http://localhost:8080/uploads  */
//  app.post("/uploads", async (req, res) => {
//      const body = req.body;
//      try{
//          const newImage = await Post.create(body)
//          newImage.save();
//          res.status(201).json({ msg : "New image uploaded...!"})
//      }catch(error){
//          res.status(409).json({ message : error.message })
//     }
//  })

app.listen(port, console.log(`Listening on port ${port}...`));

console.log("")

