import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/auth.js';

dotenv.config()

const app= express()
app.use(express.json())
app.use(cors())

const PORT=process.env.PORT||5000

mongoose.connect(process.env.MONGO_URI).then(()=>console.log("mongodb connected"))
.catch(err=>console.error("mongodb error",err))

app.use("/",routes)

app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
    
})