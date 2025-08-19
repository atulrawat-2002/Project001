const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

const signUpController = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.send(error(400, "All fields are required!"))
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.send(error(409, "User already registered!"))
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            name,
            password: hashPassword
        })


        return res.send(success(201, { user }))

    }
    catch (e) {
        console.log(e);
        res.send(error(500, e.message))
    }
}

const loginController = async (req, res) => {
    try {
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send(error(400, "All fields are required!"))
        }

        const user = await User.findOne({ email }).select("+password"); 

        if (!user) {
            return res.send(error(404, "User not found!"))
        }

        const matched = await bcrypt.compare(password, user.password);

        if (!matched) {
            return res.send(error(409, "Invalid password!"))
        }

        const accessToken = generateAccessToken({ _id: user._id });

        const refreshToken = generateRefreshToken({ id: user._id });

        res.cookie( "jwt", refreshToken, {
            httpOnly: true, 
            secure: true
        } )


        res.send(success(200, {
            user,
            accessToken
        }))
    } catch (e) {
        console.log(e);
        res.send(error(500, e.message))
    }
}

const refreshAccessTokenController = (req, res) => {
    const cookies = req.cookies;

    if(!cookies.jwt) {
        return res.send(error(401, "Refresh token is required!"))
    }

    const refreshToken = cookies.jwt; 
    
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);

        const _id = decoded._id;

        accessToken = generateAccessToken({ _id })

        return res.send(success(201, { accessToken }))
    } catch (e) {
        console.log(e);
        return res.send(error(401, "Invalid refresh token!"))
    }

}

const logOutController = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true
        })

        return res.send(success(200, "Logout successfully!"))
    } catch (e) {
        res.send(error(500, e.message))
    }
}

const generateAccessToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "1d" });
        return token;
    } catch (error) {
        console.log(error);

    }
}

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
    refreshAccessTokenController,
    logOutController
}