const mongoose = require("mongoose");

const accessPermissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      required: true,
    },
    grantedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
accessPermissionSchema.index({ user: 1, model: 1 }, { unique: true });

module.exports = mongoose.model("AccessPermission", accessPermissionSchema);
