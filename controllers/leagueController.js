const League = require("../models/League");
const bcrypt = require("bcryptjs");

// CREATE LEAGUE
// CREATE LEAGUE
exports.createLeague = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      leagueName,
      description,
      teamName,
      coachName,
      credits,
      type,
      typology,
      playerAvailability,
      gameMode,
      joinCode
    } = req.body;

    // 1. Only one league per user
    const existingLeague = await League.findOne({ createdBy: userId });
    if (existingLeague) {
      return res.status(400).json({ message: "You have already created a league." });
    }

    // 2. Validate public league
    if (type === "public" && !typology) {
      return res.status(400).json({ message: "Typology is required for public league" });
    }

    // 3. Validate private league join code
    if (type === "private" && !joinCode) {
      return res.status(400).json({ message: "Join Code is required for private league" });
    }

    const league = new League({
      leagueName,
      description,
      teamName,
      coachName,
      credits,
      type,
      typology: type === "public" ? typology : null,
      playerAvailability: type === "private" ? playerAvailability : null,
      gameMode: type === "private" ? gameMode : null,
      joinCode: type === "private" ? joinCode : null, // plain text, no hash
      createdBy: userId,
      members: [{ user: userId }]
    });

    await league.save();
    res.status(201).json({ message: "League created successfully!", league });

  } catch (error) {
    console.error("Error creating league:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// GET ALL LEAGUES
exports.getAllLeagues = async (req, res) => {
  try {
    const leagues = await League.find().select("-joinCode");
    res.status(200).json({ success: true, leagues });
  } catch (error) {
    console.error("Error fetching leagues:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// JOIN PUBLIC LEAGUE
exports.joinPublicLeague = async (req, res) => {
  try {
    const userId = req.user.id;
    const { leagueId } = req.body;

    const league = await League.findById(leagueId);
    if (!league) return res.status(404).json({ message: "League not found" });
    if (league.type !== "public") return res.status(400).json({ message: "Not a public league" });

    if (league.members.some(m => m.user.toString() === userId)) {
      return res.status(400).json({ message: "Already joined this league" });
    }

    league.members.push({ user: userId });
    await league.save();

    res.status(200).json({ message: "Joined public league successfully!" });
  } catch (error) {
    console.error("Error joining public league:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// JOIN PRIVATE LEAGUE
// JOIN PRIVATE LEAGUE
exports.joinPrivateLeague = async (req, res) => {
  try {
    const userId = req.user.id;
    const { leagueName, joinCode } = req.body;

    const league = await League.findOne({ leagueName });
    if (!league)
      return res.status(404).json({ message: "League not found" });

    if (league.type !== "private")
      return res.status(400).json({ message: "This is not a private league" });

    // Compare plain text join code
    if (league.joinCode !== joinCode)
      return res.status(400).json({ message: "Incorrect join code" });

    // Check if user already joined
    if (league.members.some(m => m.user.toString() === userId))
      return res.status(400).json({ message: "Already joined this league" });

    league.members.push({ user: userId });
    await league.save();

    res.status(200).json({ message: "Joined private league successfully!" });
  } catch (error) {
    console.error("Error joining private league:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

