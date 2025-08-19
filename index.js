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

// Configuration
// CLOUDINARY_URL=cloudinary://213451389853737:**********@djw0f2dty

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const app = express();

// Using built in middlewares
app.use(morgan());
app.use(express.json({limit: "5mb"}));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))



app.use("/auth", authRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
    res.status(200).send("Ok from server")
})

connectDB();
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Listening on port no. ${PORT} `)
})

