const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

// Controller for sign up starts
const signUpController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("All fields are required!")
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) return res.status(409).send("User already registerd!");

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashPassword
        })

        return res.status(201).json({
            user
        });

    }
    catch (error) {
        console.log(error);

    }
}

// Controller for login starts here
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send("All fields are required!");

        const user = await User.findOne({ email });

        if (!user) return res.status(404).send("User not found!");

        const matched = await bcrypt.compare(password, user.password);

        if (!matched) return res.status(409).send("Incorrect password!");

        const accessToken = generateAccessToken({ _id: user._id });

        const refreshToken = generateRefreshToken({ id: user._id });

        return res.json({
            user,
            accessToken,
            refreshToken
        })
    } catch (error) {
        console.log(error);

    }
}

// Refresh access token controller starts here
const refreshAccessTokenController = (req, res) => {
    const { refreshToken } = req.body || {refreshToken :null};

    if (!refreshToken) return res.status(401).send("Refresh token is required!")
    
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);

        const _id = decoded._id;

        accessToken = generateAccessToken({ _id })

        return res.status(201).json({ accessToken })
    } catch (error) {
        console.log(error);
        return res.status(401).send("Invalid refresh token")
    }

}

// Function for generating access token
const generateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "15m" });
        return token;
    } catch (error) {
        console.log(error);

    }
}

// Function for generation refresh token
const generateRefreshToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: "1y" });
        return token;
    } catch (error) {
        console.log(error);

    }
}

module.exports = {
    signUpController,
    loginController,
    refreshAccessTokenController
}