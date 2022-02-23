const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("./public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB")
  .then(() => {
    console.log("Connected to Mongoose");
  })
  .catch(() => {
    console.log("Connect Mongoose");
  })

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

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
})

const List = new mongoose.model("List", listSchema);

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


app.get("/:customListName", (req, res) => {
  const customListName = req.params.customListName
  List.findOne({
    name: customListName
  }, (err, foundList) => {
    if (!err) {
      if (foundList) {
        res.render("lists", {
          renderday: foundList.name,
          item: foundList.items,
          year: currentyear
        })
      } else {
        const list = new List({
          name: customListName,
          items: defaultItems
        })
        list.save();
        res.redirect("/" + customListName);
      }
    }
  })

})

app.post("/", (req, res) => {

  var newitem = req.body.listitem;
  var listname = req.body.button;
  const items = new Item({
    name: newitem
  })
  if (listname === day) {
    items.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listname
    }, (err, foundList) => {
      foundList.items.push(items);
      foundList.save();
      res.redirect("/" + listname);
    })
  }

});

app.post("/delete", (req, res) => {
  const deleteId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === day) {
    Item.findByIdAndRemove(deleteId, () => {
      res.redirect("/");
    })
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: deleteId
        }
      }
    }, (err, foundlist) => {
      if (!err) {
        res.redirect("/" + listName);
      }
    })
  }

})

app.listen(3000, () => {
  console.log("Server running at port 3000");
});