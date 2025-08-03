const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./dbConnect");
const authRouter = require("./routers/authRouter");

dotenv.config("./.env")
const app = express();


app.use("/auth", authRouter)

// app.get("/", (req, res) => {
//     res.status(200).send("Ok from server")
// })

connectDB();
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`Listening on port no. ${PORT} ` )
})

