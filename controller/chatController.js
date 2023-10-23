const Chat = require("../models/chatModel");
const Group = require("../models/groupModel");
const { Op } = require("sequelize");
// const path = require("path");
// const User = require("../models/userModel");
// const sequelize = require("../util/database");

// const io = require("socket.io")(5000, {
//     cors: {
//         origin: "http://localhost:4000",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["my-custom-header"],
//         credentials: true,
//     },
// });

//const io = require("socket.io")



module.exports.sendMessage = async (req, res) => {
    try {
        const group = await Group.findOne({
            where: { name: req.body.groupName },
        });

        await Chat.create({
            name: req.user.name,
            message: req.body.message,
            userId: req.user.id,
            groupId: group.dataValues.id,
        });
        return res.status(200).json({ message: "Success!" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "Error" });
    }
};

// exports.getMessages = async (req, res, next) => {
//     try {
//         const param = req.query.param;
//         const group = await Group.findOne({
//             where: { name: req.query.groupName },
//         });
//         const messages = await Chat.findAll({
//             where: {
//                 [Op.and]: {
//                     id: {
//                         [Op.gt]: param,
//                     },
//                     groupId: group.dataValues.id,
//                 },
//             },
//         });
//         return res.status(200).json({ messages: messages });
//     } catch (error) {
//         console.log(error);
//     }
// };


//my code

// const Chat = require("../models/chatModel");
// const { Op } = require("sequelize");


// module.exports.sendMessage = async function (req, res) {
//     await Chat.create({
//         message: req.body.message,
//         name: req.user.name,
//         userId: req.user.id
//     })

// }