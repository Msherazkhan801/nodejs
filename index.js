import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";;
import postRoutes from './Routes/post.js';
import dotenv from "dotenv"
import userRoutes from "./Routes/user.js"

const app = express();
dotenv.config();
app.use(bodyParser.json({limit:'30mb',extended:"true"}))
app.use(bodyParser.urlencoded({limit:'30mb',extended:"true"}))
app.use(cors());



app.use('/posts', postRoutes)
app.use("/user",userRoutes)
// const CONNECTION_URL ="mongodb+srv://sherazkhan801:iplex222@cluster0.pcgjslx.mongodb.net/?retryWrites=true&w=majority"

const PORT=process.env.PORT||5001;

mongoose.connect(process.env.CONNECTION_URL,{useNewUrlParser:true ,useUnifiedTopology:true})
.then(()=>app.listen(PORT,()=>console.log(`server listening on ${PORT}`)))
.catch((error)=>console.log(error.message))


// mongoose.set("useFindAndModify",false)