import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const { Schema } = mongoose;

const userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,  // searchinf filed optimization
    },
    email:{
     type:String,
     required:true,
     unique:true,
     lowercase:true,
     trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
    type:String , // cloudineary service,
    required:true,
    },
    watchHistory:[
        {
     type: Schema.Types.ObjectId,
     ref:"Video"
        }
    ],
    coverImage:{
     type:String,  // cloudinary URL
    },
    password:{
        type:String,
        required:[true,'Password required'],
        unique:true,
    },
    refreshToken:{
        type:String,
    }
},{timestamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified("password")) return next();  // checks if pass is not modifed simply call the next function else , be careful "password" is passed here in double quotes only syntax
    this.password =await bcrypt.hash(this.password,10) // encrypts pass and hashes it , with 10 rounds
    next(); // calls the next func
})

userSchema.methods.isPasswordCorrect = async function(password){   // custom methods to check if password is correct or not
  return await bcrypt.compare(password,this.password)     // return T/F
}


userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id : this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
     return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User',userSchema);