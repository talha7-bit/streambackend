import { app } from "./app.js";
import {connectdb} from "./src/db/db.js"




connectdb()

app.listen(3000,()=>{
    console.log("server is runnign on http://localhost:3000")
})

