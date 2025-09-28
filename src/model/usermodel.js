import mongoose from "mongoose"
import bcrypt from "bcrypt"


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
        },
        password:{
            type:String,
            required:true,
            minlength:3
        },
        profilepic:{
            type:String,
        },
        bio:{
            type:String
        },
        location:{
            type:String
        },
        nativelanguage:{
            type:String
        },
        learninglanguage:{
            type:String
        },
        isonboarded:{
           type:Boolean,
           default:false
        },
        fullname:{
            type:String
        },
        friends:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ]
    
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password=await bcrypt.hash(this.password,10);
    next()
})

export const User=mongoose.model("User",userSchema)