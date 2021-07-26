const express = require("express");

const app = express();
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("./public"));
app.set("view engine", "ejs");

var newitems = ["Buy Food", "Eat Food"];
let workitems = [];
var today = new Date();
var currentyear = today.getFullYear();
var day = today.toLocaleDateString("default", {
  weekday: "long"
});

app.get("/", (req, res) => {
  res.render("lists", {
    renderday: day,
    item: newitems,
    year: currentyear,
  });
});

app.get("/work", (req, res) => {
  res.render("lists", {
    renderday: "Workday",
    item: workitems,
    year: currentyear,
  })
})

app.post("/", (req, res) => {
  if (req.body.button === "Workday") {
    var workitem = req.body.listitem;
    workitems.push(workitem);
    res.redirect("/work");
  } else {
    var newitem = req.body.listitem;
    newitems.push(newitem);
    res.redirect("/");
  }
});


app.listen(3000, () => {
  console.log("Server running at port 3000");
});