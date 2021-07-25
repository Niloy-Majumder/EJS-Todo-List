const express = require("express");


const app = express();
app.use(express.urlencoded({extended:true}));

app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/index.html");
})



app.listen(3000);