import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async()=>{
    try {
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`\n MONGODB CONNECTED !! DB HOST:${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connnection error", error);
        process.exit(1);   // different exit methods
    }
}

export default connectDB