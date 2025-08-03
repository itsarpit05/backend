import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'

const app= express()    // make app for express to use

app.use(cors({       // configures cors
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json({limit:"20kb"}))  // accepts json format with limit 20kb

app.use(urlencoded({extended:true,   limit:"20kb"}))
     // encodes url 

app.use(express.static("public"))    // helps to upload static things such as avatar 

app.use(cookieParser())

export {app}