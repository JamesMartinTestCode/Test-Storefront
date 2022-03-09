const express = require("express");
const app = express();
const path = "C:/Users/jamar/OneDrive/Desktop/coding/Projects/storefront/";
const router = express.Router();
const commands = require("./commands");

app.use(express.json());
app.use(express.static("front"));

// default basic send
app.get("/", (req, res) => {
    console.log("GET req recieved")
    console.log(req.body.command);
    res.send(commands[req.body.command](req.body));
});

app.use("/", router);
app.use(express.json());

router.post("/", (req, res) => {
    console.log("Post req recieved")
    console.log(req.body.command);
    res.send(commands[req.body.command](req.body));
    
});

app.listen(3000);