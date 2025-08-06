import express,{urlencoded} from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'

const app= express()    // make app for express to use

app.use(cors({       // configures cors
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.urlencoded({ extended: true, limit: "20kb" }));  // accepts json format with limit 20kb

app.use(urlencoded({extended:true,   limit:"20kb"}))
     // encodes url 

app.use(express.static("public"))    // helps to upload static things such as avatar 

app.use(cookieParser())


//routes

import userRouter from './routes/user.routes.js'

// app.get("/", (req, res) => {
//   res.send("Server is working 🚀");
// });    Testing thing for postman

//routes declaration
app.use("/api/v1/users",userRouter)

//http://localhost:8000/api/v1/users/register

export {app}