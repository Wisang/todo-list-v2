//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/todolistDB2");
mongoose.connect("mongodb+srv://wisang:eomm6292@cluster0.zg1zig4.mongodb.net/todolistDB2");


const itemsSchema = {
  name: String
};

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

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
        res.redirect("/");
      });
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });
  // res.render("list", {listTitle: "Today", newListItems: items});

});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);
  // const customListName = req.params.customListName;

  // if (customListName === "favicon.ico") {
  //   console.log("trying to insert favicon.ico and blocked")
  // } else {
  List.findOne({
    name: customListName
  }, function(err, found) {
    if (!err) {
      if (!found) {
        console.log("trying insert with " + customListName);
        const list = new List({
          name: customListName,
          items: defaultItmes
        });
        list.save(function() {
          res.redirect("/" + customListName);
        });

      } else {
        res.render("list", {
          listTitle: found.name,
          newListItems: found.items
        });
      }
    } else {
      console.log(err);
    }
  });
  // }
});

app.post("/", function(req, res) {
  const todoItem = req.body.newItem;
  const listTitle = req.body.list;

  const itemObj = new Item({
    name: todoItem
  });

  if (listTitle == "Today") {
    itemObj.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listTitle
    }, function(err, foundList) {
      foundList.items.push(itemObj);
      foundList.save();
      res.redirect("/" + listTitle);
    })
  }

});

app.post("/delete", function(req, res) {
  const idForDelete = req.body.check;
  const listName = req.body.listName;

  if(listName === "Today") {
    Item.findByIdAndRemove({
      _id: idForDelete
    }, function(err) {
      if (err) {
        console.error(err);
      } else {
        console.log("Successfully deleted " + idForDelete);
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: idForDelete}}}, function(err, result) {
      if(!err) {
          res.redirect("/" + listName);
      }
    });
  }


});



// app.get("/work", function(req, res) {
//   res.render("list", {
//     listTitle: "Work List",
//     newListItems: workItems
//   });
// });

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
