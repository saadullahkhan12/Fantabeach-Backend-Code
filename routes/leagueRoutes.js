const express = require("express");
const router = express.Router();

const { createLeague } = require("../controllers/leagueController");
const protect = require("../middleware/auth"); // <-- match the exported name

router.post("/create", protect, createLeague);

module.exports = router;
