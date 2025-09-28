import { StreamChat } from "stream-chat";
import { Apierror } from "./Apierror.js";

const apiKey=process.env.STREAM_API_KEY || "b48jbb9y8ycd"
const apiSecret=process.env.STREAM_API_SECRET || "vedzfb6xeawj7yajwwevfqug8hhcus4s9s433p777hzsbkftz3zafqyu9x5g8km3"

if(!apiKey || !apiSecret){
    throw new Apierror("stream key or secret is missing");
}

const streamClient=StreamChat.getInstance(apiKey,apiSecret)

const upsertstreamuser=async(data)=>{
    
       try {
         await streamClient.upsertUser(data)
 
         return data;
       } catch (error) {
        console.log(error)
       }
        
   
}

const genratestreamtoken=async(id)=>{
  console.log(id)
try{
  if(!id){
    throw new Apierror(400,"id is required")
  }
  const userid=id.toString()
  const token=streamClient.createToken(userid)
  if(!token){
    throw new Apierror(400,"error occured in creating token")
  }

  return token;

}catch(error){
console.log("an error occured while creating token",error)
throw new Apierror(400,"failed to create token")
}
}

export {upsertstreamuser,genratestreamtoken}