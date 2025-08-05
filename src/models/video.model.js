import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = mongoose.schema({
    videoFile:{
     type:String,  // Cloudinary Url
     required:true,
    },
    thumbnail:{
      type:String,    //  cloudinary url
      required:true,
    },
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    duration:{
        type:Number,
        required:true,
    },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        type:Boolean,
        default:true,
    },
    owner:{
        type:Schema.Types.ObjectID,
        ref:"User",
    }


},{timestamps:true})



videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model('Video',videoSchema)