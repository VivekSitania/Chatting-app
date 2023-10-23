const User = require("../models/userModel");
const Group = require("../models/groupModel");
const UserGroup = require("../models/userGroup");
const { Op } = require("sequelize");
// const path = require("path");

module.exports.createGroup = async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const members = req.body.members;
        const admin = req.user.name;

        const group = await Group.create({ name: groupName, admin: admin });

        let invitedMembers = [];
        if (members.length !== 0) {
            // invitedMembers contain all the user row which email id matches from member array
            invitedMembers = await User.findAll({
                where: { email: { [Op.or]: members } } //here members is array so in Op.or it find the matching email in members arry from user table
            });
        }
        (async () => {
            await Promise.all(
                invitedMembers.map(async (user) => {
                    const response = await UserGroup.create({
                        isadmin: false,
                        userId: user.dataValues.id,
                        groupId: group.dataValues.id,
                    });
                })
            );

            await UserGroup.create({
                isadmin: true,
                userId: req.user.id,
                groupId: group.dataValues.id,
            });
        })(); //call

        res.status(201).json({ group: group.dataValues.name }); //, members: members
    } catch (error) {
        console.log(error);
    }
};

module.exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.findAll({
            attributes: ["name", "admin"],
            include: [
                {
                    model: UserGroup,
                    where: { userId: req.user.id },
                },
            ],
        });
        res.status(200).json({ groups: groups });
    } catch (error) {
        console.log(error);
    }
};

module.exports.addToGroup = async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const members = req.body.members;

        const group = await Group.findOne({ where: { name: groupName } });
        if (group) {
            const admin = await UserGroup.findOne({
                where: {
                    [Op.and]: [{ isadmin: 1 }, { groupId: group.id }],
                },
            });
            if (admin.userId == req.user.id) {
                let invitedMembers = [];
                if (members.length !== 0) {
                    invitedMembers = await User.findAll({
                        where: { email: { [Op.or]: members } }
                    });

                }
                await Promise.all(
                    invitedMembers.map(async (user) => {
                        const response = await UserGroup.create({
                            isadmin: false,
                            userId: user.dataValues.id,
                            groupId: group.dataValues.id,
                        });
                    })
                );
                res.status(201).json({ message: "Members Added Successfully!" });
            } else {
                res.status(201).json({ message: "Only Admins Can Add New Members" });
            }
        } else {
            res.status(201).json({ message: "Group doesn't exists! Enter the right Group name" });
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports.deleteFromGroup = async (req, res) => {
    try {
        const groupName = req.body.groupName;
        const members = req.body.members;

        const group = await Group.findOne({ where: { name: groupName } });
        if (group) {
            const admin = await UserGroup.findOne({
                where: {
                    [Op.and]: [{ isadmin: 1 }, { groupId: group.id }],
                },
            });
            if (admin.userId == req.user.id) {
                let invitedMembers = [];
                if (members.length !== 0) {
                    invitedMembers = await User.findAll({
                        where: {
                            email: {
                                [Op.or]: members,
                            },
                        },
                    });
                }


                await Promise.all(
                    invitedMembers.map(async (user) => {
                        const response = await UserGroup.destroy({
                            where: {
                                [Op.and]: [
                                    {
                                        isadmin: false,
                                        userId: user.dataValues.id,
                                        groupId: group.dataValues.id,
                                    },
                                ],
                            },
                        });
                    })
                );
                res.status(201).json({ message: "Members Deleted Successfully!" });
            } else {
                res.status(201).json({ message: "Only Admins Can Delete Members" });
            }
        } else {
            res.status(201).json({ message: "Group doesn't exists!" });
        }
    } catch (error) {
        console.log(error);
    }
};

// module.exports.groupMembers = async (req, res, next) => {
//     try {
//         const groupName = req.params.groupName;
//         const group = await Group.findOne({ where: { name: groupName } });
//         const userGroup = await UserGroup.findAll({
//             where: { groupId: group.dataValues.id },
//         });

//         const users = [];

//         await Promise.all(
//             userGroup.map(async (user) => {
//                 const res = await User.findOne({
//                     where: { id: user.dataValues.userId },
//                 });
//                 users.push(res);
//             })
//         );
//         res.status(200).json({ users: users });
//     } catch (error) {
//         console.log(error);
//     }
// };
