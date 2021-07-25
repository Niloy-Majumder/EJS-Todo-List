const express = require("express");


const app = express();
app.use(express.urlencoded({extended:true}));

app.set("viewengine", "ejs");




app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/index.html");
})



app.listen(3000);