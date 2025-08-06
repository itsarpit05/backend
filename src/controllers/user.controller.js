import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/APIerror.js';
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cLoudinary.js';
import { ApiResponse } from '../utils/APIresponse.js';


const registerUser = asyncHandler(async(req,res)=>{
   // get user details from frontend/postman
   // validation - if(!empty)
   // check if user already exists using emali,password
   //check if avatar exists
   //check for images exists
  // if exists , uplaod on cloudinary\
  //create user objct - create entry in DB
  // remove password and refresh token filed from response
  // check for user creation, if not created then show error
  //return res


  //1 step of get user data from postman
  const {fullname,email,username,password} = req.body
  console.log("email",email);

// 2 step of validation
    if(fullname===""){
        throw new ApiError(400,"fullname cannot be empty")
    }
     if(username===""){
        throw new ApiError(400," username cannot be empty")
    }
     if(email===""){
        throw new ApiError(400," email cannot be empty")
    }
     if(password===""){
        throw new ApiError(400," password cannot be empty")
    }


    //3 step of checking if user exists
    const existerUser =User.findOne({
        $or : [{username},{email}]
    })

    if(existerUser){
        throw new ApiError(409,"User already exists")
    }


// 4 step of checking if avatar exists
   const avatarLocalPath = req.files?.avatar[0]?.path
   const coverImageLocalPath = req.files?.coverImage[0]?.path

   if(!avatarLocalPath){
    throw new ApiError(400,"Avatar required")
   }

   //5 step of uplosding image and avatar on cloudinary 
  const avatar= await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar){
     throw new ApiError(400,"avatar filed required")
   }

   // step 6 of creating user objecT , entry in DB
  const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverImage : coverImage?.url ||  "",
    email,
    password,
    username:username.toLowerCase()
   })


    // step 7 of check if user is actually regitered aafter all process + //step 8 of reomving password and refreshtoken field from response
  const createdUser =await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500,"Something went wrong")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
  )
})


export {registerUser,}