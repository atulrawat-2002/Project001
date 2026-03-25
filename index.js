const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./dbConnect");
const authRouter = require("./routers/authRouter");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const postsRouter = require("./routers/postsRouter");
const cors = require("cors");
const userRouter = require("./routers/userRouter");
const cloudinary = require("cloudinary");

dotenv.config("./.env")


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const app = express();


app.use(express.json({limit: "5mb"}));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [
        "https://project001-frontend.onrender.com",
        'https://youtube-watch-party-backend-l2m1.onrender.com'
    ]
}))

async function pingYoutubeWatchParty() {

    const response = await fetch('https://youtube-watch-party-backend-l2m1.onrender.com/ping');
    console.log("Response from youtube watch party's backend", response?.statusText);

}

setInterval(async () => {
    console.log("sending request to youtube-watch party's backend")
    await pingYoutubeWatchParty()
}, 1000 * 60 * 10);


app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use(morgan("dev"));

app.get("/ping", (req, res) => {
    res.status(200).json({
        message: "Ok from connections's server"
    })
})

connectDB();
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Listening on port no. ${PORT} `)
})

