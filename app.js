//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
  name: String
};

const Item = mongoose.model('Item', itemsSchema);

const webDev = new Item({
  name: "Web development"
});
const stepping = new Item({
  name: "Stepping"
});
const chinUp = new Item({
  name: "Chin up"
});

const defaultItmes = [webDev, stepping, chinUp];

app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItmes, function(err) {
        if (err) {
          console.error(err);
        } else {
          console.log("Success");
        }
      });
    }
    res.render("list", {
      listTitle: "Today",
      newListItems: foundItems
    });
  });
  // res.render("list", {listTitle: "Today", newListItems: items});

});

app.post("/", function(req, res) {

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
