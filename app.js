const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("./public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB")

const itemsSchema = new mongoose.Schema({
  name: String
});
const Item = new mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Buy Milk"
})
const item2 = new Item({
  name: "Eat Food"
})

const defaultItems = [item1, item2];



var today = new Date();
var currentyear = today.getFullYear();
var day = today.toLocaleDateString("default", {
  weekday: "long"
});

app.get("/", (req, res) => {

  Item.find({}, (err, foundItems) => {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        console.log("Successfully added");
      });
    }
    res.render("lists", {
      renderday: day,
      item: foundItems,
      year: currentyear,
    });


  });

});



app.post("/", (req, res) => {

  var newitem = req.body.listitem;
  const items = new Item({
    name: newitem
  })
  items.save();
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const deleteId = req.body.checkbox;
  Item.findByIdAndRemove(deleteId, () => {
    res.redirect("/");
  })
})

app.listen(3000, () => {
  console.log("Server running at port 3000");
});