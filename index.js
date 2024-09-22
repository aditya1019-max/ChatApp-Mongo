const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("./models/chat.js");  // Chat after const is what we written at the end of chat.js file 
const methodOverride = require('method-override');

// Set the views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true })); //this line will parse the data from url  
app.use(methodOverride('_method'));

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
    console.log("connection successful");    // if connection successful then server started you our database named whatsapp
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

// Start the server after MongoDB connection is established
main().then(() => {
  app.listen(8080, () => {
    console.log("server is running");
  });
}).catch(err => console.log(err));

// Index Route 
app.get("/chats", async (req, res) => {
  try {
    let chats = await Chat.find();  //chat.find() is bringing data from database, it is therefore asynchronous function
    console.log(chats);
    res.render("index.ejs", { chats });  //please don't forget to pass chats as arg so that ejs file can use it 
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).send("Error fetching chats");
  }
});

// Define routes
app.get("/", (req, res) => {
  res.send("root is working");
});

// New route
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

// Create route
app.post("/chats", async (req, res) => {
  let { from, to, msg } = req.body;
  let newChat = new Chat({
    from: from,
    to: to,
    msg: msg,
    created_at: new Date(),
  });
  try {
    await newChat.save();
    console.log("chat was saved");
    res.redirect("/chats");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving chat");
  }
});

// Edit route
app.get("/chats/:id/edit", async (req, res) => {
  let { id } = req.params;
  try {
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).send("Error fetching chat");
  }
});

// Update route
app.put("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let { msg: newMsg } = req.body;  //there is no object as newMsg therefore we need to pass it as key-value pair (here, {msg: newmsg}) bcz we are renaming it to newMsg  or we could directly pass it as let { msg } = req.body; and in below line after id, { msg : msg }
  try {
    await Chat.findByIdAndUpdate(id, { msg: newMsg });
    res.redirect("/chats");
  } catch (err) {
    console.error("Error updating chat:", err);
    res.status(500).send("Error updating chat");
  }
});

//Destroy route
app.delete("/chats/:id", async (req,res) => {
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
})


// let chat1 = new Chat({
//     from: "aditya",
//     to: "priya",
//     msg: "send me your exam sheets", 
//     created_at: new Date(),
// });

// chat1.save().then((res) => {  // as soon as data(here chat) is saved the database is created 
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// });
