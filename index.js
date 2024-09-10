const express = require('express')
const app = express()
const mongoose = require('mongoose')
const env = require ('dotenv').config()
const PORT = process.env.PORT || 4500
const URI = process.env.URI
const userRoutes = require("./Routes/user.routes")

const cors = require('cors')
app.use(cors())
app.use(express.urlencoded({extended: true, limit: "200mb"}))
app.use(express.json({limit: "200mb"}))


mongoose.connect(URI)
.then(()=>{
    console.log("Datebase connect succcessfully caller fetched");
}).catch((err)=>{
    console.log(err);
})

app.use("/usercallerfetch", userRoutes)


app.get("/", (req, res)=>{
    res.status(200).json({message:"Welcome to Fetchid"})
})


app.listen(PORT, ()=>{
    console.log("Server is running on port 4500");
})