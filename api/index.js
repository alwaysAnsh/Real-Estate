import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("mongoose connected")
})
.catch((error)=>{
    console.log("error occured connecting to mongoose - ", error)
})

const app = express();

app.listen(3000, ()=>{
    console.log("App is listening at port 3000 " )
})
