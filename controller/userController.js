const path = require("path");
const { Op } = require("sequelize"); // only the Op object of sequlize is required
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
// const sequelize = require("../util/database");
// const Sib = require("sib-api-v3-sdk");


const getLoginPage = async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../public/views/login.html'));
    } catch (error) {
        console.log(error);
    }
};

const postUserSignUp = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const number = req.body.number;
        const password = req.body.password;

        const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { number }] } });

        if (existingUser) {
            res.status(409).send(`<script>alert('This email or number already exists. Please choose another one'); window.location.href='/'</script>`);
        }
        else {
            await User.create({
                name: name,
                email: email,
                number: number,
                password: password,
            });
            res.status(200).send(`<script>alert('User Created Successfully!'); window.location.href='/'</script>`);
        }
    } catch (error) {
        console.log(error);
    }
};

function generateAccessToken(id, email) {
    return jwt.sign({ userId: id, email: email }, process.env.SECRET_KEY || "OPEN-THE-LOCK");
}

const postUserLogin = async (req, res, next) => {
    try {
        const email = req.body.loginEmail;
        const password = req.body.loginPassword;

        await User.findOne({ where: { email: email } }).then((user) => {
            if (!user) {
                res.status(404).send(`<script> window.location.href='/'; alert('User not found!'); </script>`);
            }

            else if (user && user.password != password) {
                res.status(401).send(`<script> window.location.href='/'; alert('Your Password is Incorrect!'); </script>`);
            }

            else if (user && user.password == password) {
                const token = generateAccessToken(user.id, user.email);
                res.cookie("jwt_token", token); // , { maxAge: 1000, httpOnly: true } = for set the cookie expire time
                res.status(200).send(`<script> window.location.href='/homePage'; </script>`);
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    catch (err) {
        console.log(err);
    }
};

const getHomePage = async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../public/views/homePage.html'));
    } catch {
        (err) => console.log(err);
    }
};


module.exports = {
    getLoginPage,
    postUserSignUp,
    postUserLogin,
    getHomePage,
};
