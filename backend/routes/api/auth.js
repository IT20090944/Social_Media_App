const express = require("express");
const router = express.Router();

router.get("/auth", (req, res) => res.send("This is authentic page"));

module.exports = router;
