const express = require("express")

const User = require("./models/usermodel")
const {connectMongoDb} = require("./connection")
const {logReqRes} = require("./middlewares")
const users = require("./MOCK_DATA.json")
const fs = require("fs")
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express()
const port = 3000

//mongo Connection
 connectMongoDb("mongodb://127.0.0.1:27017/app-1")

//Schema



//middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors());
app.use(logReqRes("log.txt"))





// Route Handlerr Funtion
   
const getAllUsers = async (req,res)=>{
    const AllDbUsers = await User.find({})
    return res.status(200).json({
        status:"success",
        count :AllDbUsers.length,
        data:{
            users :AllDbUsers
        }
    })
};

const getSingleUser = async (req,res)=>{
    const user = await User.findById(req.params.id);
   /* // const user = users.find((user)=>user.id===id) */

    if(!user){
        return res.status(404).json({
            status:"Fail",
            message: "user with Id "+id+ " is not Found"
        })
    }

    return res.status(200).json({
        status:"success",
        data:{
            user:user
        }
    })
};

const createUser = async (req,res)=> {
    const body = req.body
    if(
        !body || !body.first_name ||
        !body.last_name || !body.email ||
        !body.gender || !body.job_title
    ){
        return res.status(400).json({
            msg:"All Fields are required"
        })
    }
    /* const newId = users[users.length-1].id +1;
    const newUser = Object.assign({id:newId},body)
    users.push(newUser)
    //users.push({...body, id:users.length +1 });
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users), (err,data)=>{
        return res.json({status:"success", id:users.length });
    }) */
    const result = await User.create({
        firstName :body.first_name,
        lastName:body.last_name,
        email :body.email,
        gender:body.gender,
        jobTitle :body.job_title,

    })
    console.log("created user", result);
    return res.status(201).json({
        msg:"user Created"
    })
    
};

const updateData = async (req,res)=>{
    const id = Number(req.params.id);
    const body = req.body;
 //  const lastName = body.last_name
    result = await User.findByIdAndUpdate(req.params.id, {lastName:body.last_name})

    return  res.status(200).json({
        status:"success",
        data :{
            user: result
        }
       
    })
    //const userToUpdate = users.find((user)=>user.id===id)
   /*  if(!userToUpdate){
        return res.status(404).json({
             status:"Fail",
             message: `No user object with Id ${id} is found`
        })
    }
    let index = users.indexOf(userToUpdate)
    const updatedData = Object.assign(userToUpdate ,newData)
    users[index] =updatedData 
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users), (err,data)=>{
        res.status(200).json({
            status:"success",
            data:{
                userdata :updatedData
            }
        })
    }) */
    
}
 const deleteData = async (req , res)=>{
    //const id = Number(req.params.id)

    const userToDelete =  await User.findById(req.params.id);
    console.log("userToDelete")

    if(!userToDelete){
        return res.status(404).json({
            status: "Fail",
            Message:"No user object with " +id +" is Found to delete"
            
        })
    }else{
        await User.deleteOne(userToDelete)
          return res.json({status:"Success"})
    }
        
    
    
    /* const index =users.indexOf(userToDelete) 

    users.splice(index,1); */

    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users), (err,data)=>{
        res.status(204).json({
            status:"success",
            data:{
                user :null
            }
        })
    })
};

//Routes
/* app.get("/users", async (req,res)=>{
    const allDbUsers = await USer.find({});
    const html = `
    <ul>
    ${AllDbUsers.map(user=>`<li>${user.firstName}</li>`).join("")}
    </ul>`;
    res.send(html)
}) */

//RestApi methods.
/* app.get("/api/users",getAllUsers);
app.get("/api/users/:id",getSingleUser);
app.post("/api/users",createUser);
app.patch("/api/users/:id",updateData)
app.delete("/api/users/:id", deleteData); */

app.route("/api/users")
    .get(getAllUsers)
    .post(createUser)

app.route("/api/users/:id")
    .get(getSingleUser)
    .patch(updateData)
    .delete(deleteData)

app.listen(port,()=>{
    console.log(`Server started at port ${port}`);
})