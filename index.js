const express = require("express");
const app = express();
const cors = require("cors");
const port = 4000;
const connectDb = require("./db")
connectDb();

var signinRouter = require("./routes/signin")
var loginRouter = require("./routes/login")
var homeRouter = require("./routes/home")


app.use(express.json())
app.use(cors({ origin: "*" }))


app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use("/signin", signinRouter)
app.use("/login", loginRouter)
app.use("/home", homeRouter)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})