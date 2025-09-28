import { Apierror } from "../utils/Apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { genratestreamtoken } from "../utils/stream.js"

export const getstreamtoken=async(req,res,next)=>{
    try {
        if(!req.user){
            throw new Apierror(400,"please login first")
        }
        const token=await genratestreamtoken(req.user._id)
        if(!token){
            throw new Apierror(400,'token not generated')
        }
        res.status(200)
        .json(
            new Apiresponse(200,token,"stream token created succesfully")
        )
    } catch (error) {
       next(error) 
    }
}