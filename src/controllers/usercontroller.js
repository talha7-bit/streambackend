import { User } from "../model/usermodel.js";
import { Apierror } from "../utils/Apierror.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import  {upsertstreamuser}  from "../utils/stream.js";



export const register=async (req,res,next)=>{
    console.log(req.body)
try{
    const {username,email,password}=req.body;
    if(!password || !email ||!username){
       throw new Apierror(400,"all fields are required")
    }

    const existed=await User.findOne({
        $or:[{username},{email}]
    })
     console.log("running",existed)
    if(existed){
        console.log("user already exist")
        throw new Apierror(400,"username or email already exist")
    }
    
    const created=await User.create({
        username,
        email,
        password
    })

    if(!created){
        throw new Apierror(400,"an error occured while creating the user")
    }

   try{
    await upsertstreamuser({
        id:created._id.toString(),
        name:created.username,
        image:created.profilepic||""
    })
   console.log(`stream user created succesfully with ${created.username}`)
   }catch(error){
    console.log(error)
   }
   const token=jwt.sign({id:created._id},process.env.TOKEN_SECRET)
    res.status(200)
    .cookie("jwt",token,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge:7*24*60*60*1000
    })
    .json(
        new Apiresponse(200,created,"user created succesfully")
    )

}catch(error){
next(error)
}
}

export const login=async(req,res,next)=>{
    try{
        const {email,username,password}=req.body;
        if(!email || !username  || !password){
            throw new Apierror(400,"all fileds are required")
        }

        const existed=await User.findOne({
            $and:[{email},{username}]
        })

        if(!existed){
            throw new Apierror(400,"user does not exist")
        }
        const result=await bcrypt.compare(password,existed.password)
        if(!result){
            throw new Apierror(400,"password is incorrect")
        }
       const token=jwt.sign({_id:existed._id},process.env.TOKEN_SECRET)

       res.status(200)
       .cookie("jwt",token,{
         httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge:7*24*60*60*1000
       })
       .json(
        new Apiresponse(200,existed,"user logged in succesfully")
       )

    }catch(error){
        next(error)
    }
}

export const logout=async(req,res,next)=>{
    try{
    
    if(!req.user){
        throw new Apierror(400,"please login first")
    }
    const existed=await User.findById(req.user._id).select("-password")


    res.status(200)
    .clearCookie("jwt",{
         httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge:7*24*60*60*1000
    })
    .json(
        new Apiresponse(200,{existed},"user logged out succesfully")
    )

    }catch(error){
        next(error)
    }
}

export const isonboard=async(req,res,next)=>{
    //console.log(req.body)
    try{
        if(!req.user){
            throw new Apierror(400,"please signup first")
        }
        const {bio,nativelanguage,learninglanguage,fullname,profilepic}=req.body;
        
        if(!fullname || !bio || !learninglanguage || !nativelanguage ||!profilepic){
            throw new Apierror(400,`all fileds are required`)
        }
        const update=await User.findByIdAndUpdate(req.user._id,{
            bio,
            nativelanguage,
            learninglanguage,
            fullname,
            profilepic,
            isonboarded:true
        },{new:true})
    
       if(!update){
        throw new Apierror(400,"user not found")
       }
      try {
        const updated=await upsertstreamuser({
          id:update._id,
          name:update.fullname,
          image:update.profilepic,
          language:update.nativelanguage
        })
        console.log(`stream updated succesfully for ${update.username}`)

       
      } catch (error) {
        console.log("an error occured while updating stream")
        throw new Apierror(400,"error occured while updating stream")
      }

      

      res.status(200)
      .json(
        new Apiresponse(200,update,`user updated succesfully for ${update.fullname}`)
      )
  
    }catch(error){
        next(error)
    }
}