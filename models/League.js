const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema(
  {
    leagueName: { type: String, required: true },
    description: { type: String },
    teamName: { type: String, required: true },
    coachName: { type: String, required: true },
    credits: { type: Number, default: 0 },

    type: { type: String, enum: ["public", "private"], required: true },
    typology: { type: String, default: null }, // only for public

    playerAvailability: { type: String, default: null }, // only for private
    gameMode: { type: String, default: null }, // only for private

    joinCode: { type: String, default: null }, // hashed code for private

    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        joinedAt: { type: Date, default: Date.now }
      }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("League", LeagueSchema);
