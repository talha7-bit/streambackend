import mongoose from "mongoose"
import { Request } from "../model/requestmodel.js"
import { User } from "../model/usermodel.js"
import { Apierror } from "../utils/Apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js"


export const getrecommended=async(req,res,next)=>{
    try {
        if(!req.user){
            throw new Apierror(400,"please login first")
        }

        const recommended=await User.find({
            $and:[
               { _id:{$ne:req.user._id,$nin:req.user.friends}},
                {isonboarded:true}
            ]
        })
        res.status(200)
        .json(
            new Apiresponse(200,recommended,"recommended users fetched succesfully")
        )
    } catch (error) {
       next(error) 
    }
}

export const getfriends=async(req,res,next)=>{
    try {
        if(!req.user){
            throw new Apierror(400,"please login first")
        }
      const myfriends=await User.findById(req.user._id).select("friends").populate("friends","profilepic nativelanguage fullname learninglanguage")
      if(!myfriends){
        throw new Apierror(400,"error fetching friends")
      }
      res.status(200)
      .json(
        new Apiresponse(200,myfriends,"friends fetched succesfully")
      )
    } catch (error) {
        next(error)
    }
}

export const sendrequest=async(req,res,next)=>{
    console.log("entering")
    try {
        const userid=req.params.id

        if(!req.user){
            throw new Apierror(400,"please login first")
        }
        
        if(req.user._id.toString()==userid){
            throw new Apierror(400,"you cannot send request to yourself")
        }

        const receiver=await User.findById(userid);

        if(!receiver){
            throw new Apierror(400,"recepient not found")
        }

        if(receiver.friends.includes(req.user._id)){
            throw new Apierror(400,"you have already send the friend request")
        }
        const userobjectid=new mongoose.Types.ObjectId(userid)
        const friends=await Request.findOne(
       {
        $or:[
            {sender:req.user._id,recepient:userobjectid},
            {sender:userobjectid,recepient:req.user._id}
        ]
       }
        )

        if(friends){
            throw new Apierror(400,"friend request already exist")
        }

        const request=await Request.create({
            sender:req.user._id,
            recepient:userid,
            status:"pending"
        })

        if(!request){
            throw new Apierror(400,'unable to send friend request')
        }

        res.status(200)
        .json(
            new Apiresponse(200,{},"friend request send succesfully")
        )
    } catch (error) {
        next(error)
    }
}

export const acceptrequest=async(req,res,next)=>{
    try {
        const userid=req.params.id;
        console.log("userid",userid)
        if(!req.user){
            throw new Apierror(400,"please login first")
        }
        const user=req.user;
        const requesteduser=await Request.findOne({
            recepient:req.user._id,
            sender:userid,
            status:"pending"
        })

        if(!requesteduser){
            throw new Apierror(400,"request does not exist")
        }
       

        requesteduser.status="accepted";
       await requesteduser.save();
       
        

       await User.findByIdAndUpdate(userid,{
        $addToSet:{friends:user}
       },{new:true})
       await User.findByIdAndUpdate(user,{
        $addToSet:{friends:userid}
       },{new:true})
        res.status(200)
        .json(
            new Apiresponse(200,{},"friend request accepted succesfully")
        )
    } catch (error) {
        next(error)
    }
}

export const getincomingfriendrequest=async(req,res,next)=>{
    try {
        if(!req.user){
            throw new Apierror(400,"please login first")
        }

        const requset=await Request.find({recepient:req.user._id,status:"pending"}).populate("sender","fullname profilepic nativelanguage learninglanguage")
        res.status(200)
        .json(
            new Apiresponse(200,requset,"incoming friend requests fetched succesfully")
        )
        
    } catch (error) {
        next(error)
    }
}

export const getoutgoingfriendrequest=async(req,res,next)=>{
    try {
        if(!req.user){
            throw new Apierror(400,"please login first")
        }

        const request=await Request.find({sender:req.user._id,status:"pending"}).populate("recepient","fullname profilepic nativelanguage learninglanguage")
    res.status(200)
    .json(
        new Apiresponse(200,request,"outgoingrequest fetched succesfully")
    )
    } catch (error) {
        next(error)
    }
}