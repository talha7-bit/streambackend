import express from "express";
import { verify } from "../../middelwares/verifymiddelware.js";
import { getstreamtoken } from "../controllers/chatcontroller.js";


const router=express.Router();

router.get("/token",verify,getstreamtoken)


export default router;