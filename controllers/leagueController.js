const League = require("../models/League");

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

    const existingLeague = await League.findOne({ createdBy: userId });
    if (existingLeague) {
      return res.status(400).json({
        message: "You have already created a league.",
      });
    }

    if (type === "public" && !typology) {
      return res.status(400).json({ message: "Typology is required for public league" });
    }

    // Auto-generate join code for private league
    let finalJoinCode = joinCode;
    if (type === "private") {
      if (!finalJoinCode) {
        finalJoinCode = Math.floor(1000 + Math.random() * 9000).toString();
      }
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
      joinCode: type === "private" ? finalJoinCode : null,
      createdBy: userId,
    });

    await league.save();
    res.status(201).json({ message: "League created successfully!", league });

  } catch (error) {
    console.error("Error creating league:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
