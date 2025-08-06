// require('dotenv').config()
import dotenv from "dotenv"
// import mongoose from "mongoose";
// import {DB_NAME} from  "./constants" ;
import connectDB from "./db/index.js";
import { app } from "./app.js"; 

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server running at port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGODB CONNECTION FAILED",err);
})






/*
Apporach 1 to connect DB

import express from "express";

const app = express()
// function connectDB(){}   This is okay but can be implemented usng iffe

(async()=>{
    try{
     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
     app.on("error",(error)=>{
        console.log("ERR:" ,error);
        throw error
     })

    app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
    })


    }catch(error){
        console.error("ERROR:" , error)
        throw err
    }
})()    // ; is just for cleaning purpose , added in front of function 




// connectDB() part above comments


*/