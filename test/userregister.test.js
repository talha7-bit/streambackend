import request from "supertest"
import mongoose from "mongoose"
import { app } from "../app.js";

beforeAll(async()=>{
    await mongoose.connect("mongodb://localhost:27017/stream")
})

afterAll(async()=>{
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close()
})

describe('POST/api/user/register',()=>{
    it("should register a new user succesfully",async()=>{
    const res=await request(app)
    .post("/api/user/register")
    .send({
        "username":"talha",
        "email":"talha@gmail.com",
        "password":"abcd"
    })
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("statuscode",200)
    expect(res.body).toHaveProperty("message","user created succesfully")
    expect(res.body.data).toHaveProperty("email","talha@gmail.com")
    })
    
    it("should not register user with existing email",async()=>{
        const res=await request(app)
        .post("/api/user/register")
        .send({
            "username":"talha",
            "email":"talha@gmail.com",
            "password":"abcd"
        })
        expect(res.statusCode).toBe(400)
        expect(res.body).toHaveProperty("statuscode",400)
        expect(res.body).toHaveProperty("message","user already exist")
    })
})




beforeAll(async()=>{
    await mongoose.connect("mongodb://localhost:27017/stream")
    await mongoose.connection.db.dropDatabase();

    await request(app)
    .post("/api/user/login")
    .send({
        "username":"talha",
        "email":"talha@gmail.com",
        "password":"abcd"
    })
})

afterAll(async()=>{
    
    await mongoose.connection.close();
})

describe('POST/api/user/login',()=>{
it("should login the user with credintals",async()=>{
    const res=await request(app)
    .post("/api/user/login")
    .send({
        "username":"talha",
        "email":"talha@gmail.com",
        "password":"abcd"
    })
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty("statuscode",200)
    expect(res.body).toHaveProperty("message","user logged in succesfully")
    expect(res.body.data).toHaveProperty("email","talha@gmail.com")
})
it("should not login user with wrong credintals",(async()=>{
    const res=await request(app)
    .post("/api/user/login")
    .send({
        "username":"talh",
        "email":"talh@gmail.com",
        "password":"abcd"
    })
    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty("statuscode",400)
    expect(res.body).toHaveProperty("message","user does not exist")
}))
})

describe("user logout api",()=>{
    let authcookie;
    beforeAll(async()=>{
        await mongoose.connect("mongodb://localhost:27017/stream")
        await mongoose.connection.db.dropDatabase();


         await request(app)
         .post("/api/user/register")
         .send({
            "username":'talha',
            "email":"talha@gmail.com",
            "password":"abcd"
         })

         const res=await request(app)
         .post("/api/user/login")
         .send({
            "username":"talha",
            "email":"talha@gmail.com",
            "password":"abcd"
         })
       authcookie=res.headers["set-cookie"]

    });
    it("should logout user",async()=>{
        const res=await request(app)
        .get("/api/user/logout")
        .set("Cookie",authcookie)

        expect(statusCode).toBe(200)
        expect(res.body).toHaveProperty("statuscode",200)
        expect(res.body).toHaveProperty("message","user logged out succesfully")
    })
    it("should not logout without cookie",async()=>{
    const res=await request(app)
    .get("/api/user/logout")
    
    expect(statusCode).toBe(400)
    expect(request.body).toHaveProperty("message","please login first")
    })


})