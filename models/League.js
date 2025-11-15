const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema(
  {
    leagueName: { type: String, required: true },
    description: { type: String },

    // TEAM INFO
    teamName: { type: String, required: true },
    coachName: { type: String, required: true },
    credits: { type: Number, required: true, default: 0 },

    // TYPE: public OR private
    type: {
      type: String,
      enum: ["public", "private"],
      required: true,
    },

    // PUBLIC ONLY
    typology: {
      type: String,
      enum: ["ordinary", "asta", "abuste", "di-persona"],
      default: null,
    },

    // PRIVATE ONLY
    playerAvailability: {
      type: String,
      enum: ["single", "multiple"],
      default: null,
    },
    gameMode: {
      type: String,
      enum: ["classic", "mantra"],
      default: null,
    },
    joinCode: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("League", LeagueSchema);
