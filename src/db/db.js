import mongoose from "mongoose";


const connectdb=async()=>{
    const MONGODBURI=process.env.MONGODB_URI
    try{
        const connect=await mongoose.connect(`${MONGODBURI}/stream`)
        console.log("mongodb connected !!",connect.connection.host)

    }catch(error){
        console.log("an error occured while connecting to database",error)
    }
}

export {connectdb}