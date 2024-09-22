const mongoose = require("mongoose");
const Chat = require("./models/chat");

// Connect to MongoDB
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
        console.log("connection successful");

        // Insert multiple chat documents
        await Chat.insertMany(allChats);
        console.log("Chats inserted successfully");
    } catch (err) {
        console.log(err);
    }
}

let allChats = [
    {
        from: "neha",
        to: "sakshi",
        msg: "send me notes for the exam",
        created_at: new Date(),
    },
    {
        from: "aditya",
        to: "rinku",
        msg: "send me science notes",
        created_at: new Date(),
    },
    {
        from: "shravani",
        to: "yukti",
        msg: "hwllo yukti!!! whats up",
        created_at: new Date(),
    },
    {
        from: "ruchika",
        to: "kalyani",
        msg: "aaj tution madhe kay shikwala",
        created_at: new Date(),
    },
];

main();
