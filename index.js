require('dotenv').config();

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { signInRouter} = require("./src/signIn");
const transitionRouter = require("./src/sync/transition");
const ReprintRouter = require("./src/sync/reprint");

app.use("/signin", signInRouter);
app.use("/transition", transitionRouter);
app.use("/reprint", ReprintRouter);

const PORT = process.env.PORT || 3001;
app.listen((PORT) , () => {
    console.log(`Express server listening on port ${PORT}`);
})