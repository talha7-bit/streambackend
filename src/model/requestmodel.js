import mongoose from "mongoose";


const requestSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recepient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["pending","accepted"],
        default:"pending"
    }
})

export const Request=mongoose.model("Request",requestSchema)