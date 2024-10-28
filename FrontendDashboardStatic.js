const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.resolve(__dirname, 'frontend', 'dashboard')));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dashboard', 'index.html'));
});

module.exports = app;