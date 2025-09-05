const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const { mongoose } = require("mongoose");
const { config } = require("./config/config");

// connect DB
config();

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("json spaces", 2);
app.use(express.json());


// Controllers
const { LoginStart, LoginVerify } = require("./controllers/Auth/Login")
const { Register } = require("./controllers/Auth/Register")
const { Logout } = require("./controllers/Auth/Logout")
const { ForgetPassword } = require("./controllers/Auth/Password")
const { ResetPassword } = require("./controllers/Auth/Password")
const { getProfile, changePass, changeFLname, enableOtp } = require("./controllers/Profile/Profile")
const { getAllNotes, getNoteById, addNote, updateNote, updatePartially, deleteNote } = require("./controllers/Notes/Notes")
const { getAllCategories, createCategory, deleteCategory } = require("./controllers/Category/Category")
const { getHome } = require("./controllers/Home/Home")


// Auth Render
app.get('/auth/register', (req, res) => { res.render('auth/Register') })
app.get('/auth/login/start',(req,res)=>{ res.render('auth/LoginStart') })
app.get('/auth/login/verify',(req,res)=>{ res.render('auth/loginVerify') })
app.get('/auth/logout',(req,res)=>{ res.render('auth/Logout') })
app.get('/auth/forget-password',(req,res)=>{ res.render('auth/ForgetPass') })
app.get('/auth/reset-password',(req,res)=>{ res.render('auth/ResetPass') })

// Auth API
app.post("/auth/login/start",LoginStart)
app.post("/auth/login/verify",LoginVerify)
app.post("/auth/Register",Register)
app.post("/auth/reset-password/start",ResetPassword)
app.post('/auth/forgot-password',ForgetPassword)
app.delete('/auth/logout',Logout)


// Profile
app.get('/profile/view',(req,res)=>{ res.render('Profile/profile') })
app.get('/profile',getProfile)
app.put('/profile/change-password',changePass)
app.put('/profile/change-first-last-name',changeFLname)
app.put('/profile/enable-otp',enableOtp)




// Notes Render
app.get('/notes',(req,res)=>{ res.render('Notes/notes') })
// Notes
app.get('/notes',getAllNotes)
app.get('/notes/:id',getNoteById)
app.post('/notes',addNote)
app.put('/notes/:id',updateNote)
app.patch('/notes/:id',updatePartially)
app.delete('/notes/:id',deleteNote)


// Category Render
app.get('/categories',(req,res)=>{ res.render('Categories/categories') })
// Category
app.get('/category',getAllCategories)
app.post('/category',createCategory)
app.delete('/category/:id',deleteCategory)


// Home
app.get('/home',(req,res)=>{ res.render('Home/home') })
app.get('/',getHome)


mongoose.connection.once('open', () => {
    console.log("MongoDB connected!!")
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}....`)
    })
})
mongoose.connection.on('error', (err) => {
    console.log("MongoDB connection error")
    console.log(err);
})

module.exports = {app};