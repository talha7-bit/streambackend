import express from "express"
import userrouter from "./src/routes/userroute.js"
import friendroute from "./src/routes/friendroute.js"
import chatrouter from "./src/routes/chatroute.js"
import { Apierror } from "./src/utils/Apierror.js";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"

const app=express();
app.use(cookieParser())
dotenv.config()
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use("/api/user",userrouter)
app.use("/api/friend",friendroute)
app.use("/api/chat",chatrouter)

app.use((err,req,res,next)=>{
  if(err instanceof Apierror){
    return res.status(err.statuscode).json({
      statuscode:err.statuscode,
      message:err.message
    })

  
  }
  return res.status(500).json({
    statuscode:500,
    message:"internal server error"
  })
})



app.get("/",(req,res)=>{
  res.send("good")  
})

export {app}