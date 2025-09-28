import { User } from "../src/model/usermodel.js";
import { Apierror } from "../src/utils/Apierror.js";
import jwt from "jsonwebtoken"

export const verify=async(req,res,next)=>{
    try{
        
        const token=req.cookies?.jwt;
        if(!token){
            throw new Apierror(400,"please signup first")
        }
        const debugged=jwt.verify(token,process.env.TOKEN_SECRET)
        const user=await User.findById(debugged._id || debugged.id);
        req.user=user
        next()
    }catch(error){
     next(error);
    }
}