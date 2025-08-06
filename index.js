const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./dbConnect");
const authRouter = require("./routers/authRouter");
const morgan = require("morgan");
const cookieParser  = require("cookie-parser");
const postsRouter = require("./routers/postsRouter");
const cors = require("cors");

dotenv.config("./.env")
const app = express();

// Using built in middlewares
app.use(morgan());
app.use(express.json("common"));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173" 
}))

// const getData = async () => {
//   const res = await fetch("http://localhost:4000/auth/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       email: "abc@gmail.com",
//       password: "1234"
//     })
//   });

//   const data = await res.json(); // <- Get actual response body
//   console.log(data);
// };


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

