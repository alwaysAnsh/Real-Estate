import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from '../api/routes/user.routes.js'
import authRoutes from '../api/routes/auth.routes.js'
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("mongoose connected")
})
.catch((error)=>{
    console.log("error occured connecting to mongoose - ", error)
})


const app = express();
app.use(express.json());

app.listen(3000, ()=>{
    console.log("App is listening at port 3000 " )
})

app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)
