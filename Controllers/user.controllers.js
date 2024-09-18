const { Userschema } = require("../Models/user.models")
const axios = require('axios')
const env = require('dotenv')
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
// const apiKey = process.env.TRUECALLER_API_KEY;

env.config()

module.exports.userwelcome = (req, res) => {
    res.send("welcome to the user db")
}

module.exports.register = async (req, res) => {
    // console.log(req.body);
    const { Email, Username } = req.body;
    try {
        const existingUser = await Userschema.findOne({ Email: Email });
        if (existingUser) {
            console.log("Email is already in used");
            return res.status(200).json({ message: "Email is already in used", status: false });
        }
        const existingUserByUsername = await Userschema.findOne({ Username: Username });
        if (existingUserByUsername) {
            console.log("Username is already in used");
            return res.status(200).json({ message: "Username is already in used", status: false });
        }
        else {
            const newUser = new Userschema(req.body);
            await newUser.save();
            console.log("User Details saved");
            res.send({ status: true, message: "Success" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error. Please try again later.", status: false });
    }
}

module.exports.login = (req, res) => {
    let { Email, Password } = req.body;
    Userschema.findOne({ Email: Email }).then(async (user) => {
        if (!user) {
            res.status(200).json({ message: "Email Not Found", status: false })
            console.log("Email not found");
        }
        else {
            const correctpassword = await user.compareUser(Password)
            if (!correctpassword) {
                res.status(200).json({ message: "Incorrect Password", status: false })
                console.log("Incorrect Password");
            }
            else {
                let token = jwt.sign({ id: user.id }, secret, { expiresIn: "24h" })
                const userDatas = {
                    userId: user.id,
                    username: user.Username,
                    number: user.Number,
                    email: user.Email,
                }
                res.status(200).json({ message: "Login Success", status: true, token, userDatas })
                console.log("user success", userDatas);
            }

        }
    })
        .catch((err) => {
            console.log("error occured", err);
            // return res.status(200).json({ message: "Error Occured", status: false })
            return res.status(500).json({ message: "Internal Server Error. Please try again later.", status: false });
        })
}

module.exports.db = (req, res) => {
    console.log(req.body);
    // const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    let token = req.headers.authorization.split(" ")[1]
    if (!token) {
        return res.status(401).send({ status: false, message: "Authorization token missing" });
    }

    jwt.verify(token, secret, ((err, result) => {
        if (err) {
            res.send({ status: false, message: "wrong token" })
            console.log(err);
        }
        else {
            Userschema.findOne({ _id: result.id }).then((user) => {
                res.send({ status: true, message: "Success token correct", user })
                console.log(user);
            })
                .catch((err) => {
                    console.log("error Occured", err);
                    res.status(500).send({ status: false, message: "Internal server error" });
                })
        }
    }))
}