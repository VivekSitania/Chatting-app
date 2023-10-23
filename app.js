const dotenv = require("dotenv");
dotenv.config();

const http = require('http');
const express = require('express');
const { Server } = require("socket.io");
const PORT = process.env.PORT || 2500;
const app = express();
const server = http.createServer(app); //http server which contain express server
const io = new Server(server); //socket io server which conatin http server

//socket.io
// io.on("connection", (socket) => {
//     console.log("new user connected", socket.id);
// })


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static("public"));

const sequelize = require("./util/database");

// const path = require("path");
// const fs = require("fs");

// const cors = require("cors");
// app.use(
//   cors({
//     origin: "*",
//   })
// );


//Router
const userRouter = require("./router/userRouter");
const chatRouter = require("./router/chatRouter");
const groupRouter = require("./router/groupRouter");

//Middleware
app.use("/", userRouter);
app.use("/chat", chatRouter);
app.use("/group", groupRouter);

// app.use("/user", userRouter);

// const job = require("./jobs/cron");
// job.start();

//Models
const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Group = require("./models/groupModel");
const UserGroup = require("./models/userGroup");

//Relationships between Tables
User.hasMany(Chat); // User.hasMany(Chat, { onDelete: "CASCADE", hooks: true });
Chat.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

//many to many between user and group, thats why we have to make a juncton model or table called userGroup
User.hasMany(UserGroup);
Group.hasMany(UserGroup);
UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);

io.on("connection", (socket) => {
    // console.log("new user connected", socket.id);
    socket.on("getMessages", async (groupName) => {
        try {
            const group = await Group.findOne({ where: { name: groupName } });
            const messages = await Chat.findAll({
                where: { groupId: group.dataValues.id },
            });
            // console.log("Request Made");
            io.emit("messages", { data: messages, groupName: groupName }); //you can sen multiple event eg."group", groupName and listend particular event sepratelly
        } catch (error) {
            console.log(error);
        }
    });
});

sequelize.sync() //{ force: true }
    .then((result) => {
        server.listen(PORT, function (err) {
            if (err) {
                console.log(`Error in running the server: ${err}`);
            }
            else {
                console.log(`Server is running on port: ${PORT}`);
            }
        });
    }).catch((err) => console.log(err));
