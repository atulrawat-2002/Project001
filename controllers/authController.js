const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

// Controller for sign up starts
const signUpController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            // return res.status(400).send("All fields are required!")
            return res.send(error(400, "All fields are required!"))
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            // return res.status(409).send("User already registerd!");
            return res.send(error(409, "User already registered!"))
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashPassword
        })

        // return res.status(201).json({
        //     user
        // });

        return res.send(success(201, { user }))

    }
    catch (e) {
        console.log(e);
    }
}

// Controller for login starts here
const loginController = async (req, res) => {
    try {
        console.log(req.body);
        
        const { email, password } = req.body;

        if (!email || !password) {
            // return res.status(400).send("All fields are required!");
            return res.send(error(400, "All fields are required!"))
        }

        const user = await User.findOne({ email });

        if (!user) {
            // return res.status(404).send("User not found!");
            return res.send(error(404, "User not found!"))
        }

        const matched = await bcrypt.compare(password, user.password);

        if (!matched) {
            // return res.status(409).send("Incorrect password!");
            return res.send(error(409, "Invalid password!"))
        }

        const accessToken = generateAccessToken({ _id: user._id });

        const refreshToken = generateRefreshToken({ id: user._id });

        res.cookie( "jwt", refreshToken, {
            httpOnly: true,
            secure: true
        } )

        // return res.json({
        //     user,
        //     accessToken
        // })

        res.send(success(200, {
            user,
            accessToken
        }))
    } catch (e) {
        console.log(e);

    }
}

// Refresh access token controller starts here
const refreshAccessTokenController = (req, res) => {
    const cookies = req.cookies;

    if(!cookies.jwt) {
        // return res.status(401),send("Refrsh Token is require!");
        return res.send(error(401, "Refresh token is required!"))
    }

    const refreshToken = cookies.jwt; 
    
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);

        const _id = decoded._id;

        accessToken = generateAccessToken({ _id })

        // return res.status(201).json({ accessToken })
        return res.send(success(201, { accessToken }))
    } catch (e) {
        console.log(e);
        // return res.status(401).send("Invalid refresh token")
        return res.send(error(401, "Invalid refresh token!"))
    }

}

// Function for generating access token
const generateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "20s" });
        return token;
    } catch (error) {
        console.log(error);

    }
}

// Function for generation refresh token
const generateRefreshToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: "1d" });
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