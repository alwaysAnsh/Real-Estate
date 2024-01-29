import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from '../api/routes/user.routes.js'
import authRoutes from '../api/routes/auth.routes.js'
import cookieParser from 'cookie-parser';
import listingRoutes from '../api/routes/listing.routes.js'
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("mongoose connected")
})
.catch((error)=>{
    console.log("error occured connecting to mongoose - ", error)
})


const app = express();
app.use(express.json());

app.use(cookieParser())

app.listen(3000, ()=>{
    console.log("App is listening at port 3000 " )
})

app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/listing',listingRoutes)

//creating a middleware
app.use((err, req, res, next ) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
