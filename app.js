const express = require("express");

const app = express();
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("./public"));
app.set("view engine", "ejs");

var newitems = ["Buy Food", "Eat Food"];
var today = new Date();
var currentDay = today.getDay();
var day = today.toLocaleDateString("default", {
  weekday: "long"
});

app.get("/", (req, res) => {
  res.render("lists", {
    renderday: day,
    item: newitems
  });
});

app.post("/", (req, res) => {
  var newitem = req.body.listitem;
  newitems.push(newitem);
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running at port 3000");
});