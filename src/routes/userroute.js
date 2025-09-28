import express from "express"
import { isonboard, login, logout, register } from "../controllers/usercontroller.js";
import { verifyjwt } from "../../middelwares/authmiddelware.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { verify } from "../../middelwares/verifymiddelware.js";
import { User } from "../model/usermodel.js";
import { Apierror } from "../utils/Apierror.js";

const router=express.Router();


router.post("/register",register)

router.post("/login",login)

router.post("/logout",verify,logout)

router.post("/onboard",verify,isonboard)

router.get("/me",verify,async(req,res,next)=>{
    console.log("req.user",req.user)
    try {
        console.log("entered",req.user._id)
        if(!req.user){
            throw new Apierror(400,"plesse signup first")
        }
        res.status(200).json(new Apiresponse(200,req.user,"req.user fetched succesfully"))
    } catch (error) {
        next(error)
    }
})

export default router