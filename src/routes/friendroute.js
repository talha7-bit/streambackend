import express from "express"
import { verifyjwt } from "../../middelwares/authmiddelware.js";
import { acceptrequest, getfriends, getincomingfriendrequest, getoutgoingfriendrequest, getrecommended, sendrequest } from "../controllers/friendcontroller.js";
import { verify } from "../../middelwares/verifymiddelware.js";


const router=express.Router();


router.get("/",verify,getrecommended)

router.get("/friends",verify,getfriends)

router.post("/sendrequest/:id",verify,sendrequest)

router.post("/acceptrequest/:id",verify,acceptrequest)

router.get("/getincoming",verify,getincomingfriendrequest)

router.get("/getoutgoing",verify,getoutgoingfriendrequest)

export default router;