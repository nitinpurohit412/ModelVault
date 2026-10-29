const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required : true
    },
    provider: {
      type: String,
      required : true
    },
    description: {
      type: String,
      required : true
    },
    isActive: {
      type: Boolean,
      default : false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Model", modelSchema);
