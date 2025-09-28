import { User } from "../src/model/usermodel.js";
import { Apierror } from "../src/utils/Apierror.js";
import jwt from "jsonwebtoken"

export const verifyjwt=async(req,res,next)=>{
    try{
        const token=req.cookies?.token;
        if(!token){
            throw new Apierror(400,"please login first")
        }
        const debugged=jwt.verify(token,process.env.TOKEN_SECRET)
        const user=await User.findById(debugged._id);
        req.user=user
        next()
    }catch(error){
     next(error);
    }
}