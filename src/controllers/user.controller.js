import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/APIerror.js';
import {User} from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cLoudinary.js';
import { ApiResponse } from '../utils/APIresponse.js';
import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async(userId)=>{
  try {
      const user =await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken= user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({validateBeforeSave:false})

      return {accessToken,refreshToken}


  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating access and refreshtoken")
  }
}


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
    const existerUser =await User.findOne({
        $or : [{username},{email}]
    })

    if(existerUser){
        throw new ApiError(409,"User already exists")
    }


    console.log("BODY:", req.body);




// 4 step of checking if avatar exists
  //  const avatarLocalPath = req.files?.avatar[0]?.path
//    const coverImageLocalPath = req.files?.coverImage[0]?.path
let avatarLocalPath;

if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
  avatarLocalPath = req.files.avatar[0].path;
} else {
  throw new ApiError(400, "Avatar file is required");
}





let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalPath = req.files.coverImage[0].path
}

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

const loginUser = asyncHandler(async(req,res)=>{
    //Get user details from postman/backend
    // validation check 
    //Find the user 
    // if not found throw err
    // if found check for password
    // if password wrong throw err
    // if password correct generate access token and refresh token 
    // send cookies
    //logged In

    //1.
    const {email,username,password} = req.body

    if(!username && !password){
      throw new ApiError(400,"username or password required")
    }


    //3.
    const user = await User.findOne({
      $or:[{ username },{ email }]
    })

    if(!user){
      throw new ApiError(404,"User not found")
    }

    //password check step
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
      throw new ApiError(404,"Wrong credentials")
    }

    //generate acces and refresh tokens

   const {accessToken,refreshToken}= await generateAccessAndRefreshTokens(user._id)


   //send cookies
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

   const options = {
    httpOnly:true,
    secure:true,
   }


   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(
      200,
      {
        user:loggedInUser,accessToken,refreshToken
      },
      "User loggedIn successfully"
    )
   )
})

const logoutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },{
      new:true
    }
   )
      const options = {
    httpOnly:true,
    secure:true,
   }

   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200,{},"User logged Out"))
})

//End point for refresh token

const refreshAccessToken = asyncHandler(async(req,res)=>{
   const incomingRefreshToken = req.cookies(refreshToken || req.body.refreshToken)  // decoded token i.e. raw token

   if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorized request")
   }
 try {
   const decodedToken = jwt.verify(
     incomingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET
   )
   const user = await User.findById(decodedToken?._id)
    if(!user){
     throw new ApiError(401,"Invalid refresh token")
    }
 
    if(incomingRefreshToken!== refreshToken){
     throw new ApiError(401,"Refresh token expired")
    }
 
    const options ={
     httpOnly:true,
     secure:true
    }
 
 const {accessToken,newRefreshToken}= await generateAccessAndRefreshTokens(user._id)
 
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",newRefreshToken,options)
   .json(
     new ApiResponse(
       200,
       {accessToken,refreshToken:newRefreshToken},
       "Access token refreshed successfully"
     )
   )
 
 } catch (error) {
   throw new ApiError(401,error?.message || "Invalid refresh token")
 }
  

})

export {registerUser,loginUser,logoutUser,refreshAccessToken}