const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./dbConnect");
const authRouter = require("./routers/authRouter");
const morgan = require("morgan");
const postsRouter = require("./routers/postsRouter");

dotenv.config("./.env")
const app = express();

// Using built in middlewares
app.use(morgan());
app.use(express.json("common"));


app.use("/auth", authRouter)
app.use("/posts", postsRouter);

app.get("/", (req, res) => {
    res.status(200).send("Ok from server")
})

// Function for database connection after that server will start listening
connectDB();
const PORT = process.env.PORT || 4000 
app.listen(PORT, () => {
    console.log(`Listening on port no. ${PORT} ` )
})

