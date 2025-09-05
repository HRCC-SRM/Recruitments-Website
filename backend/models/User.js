import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  srmEmail: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/,
      "Please enter a valid SRMIST email",
    ],
  },
  regNo: {
    type: String,
    required: true,
    unique: true,
  },
  branch: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  yearOfStudy: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
  },
  domain: {
    type: String,
    required: true,
    enum: ["Technical", "Corporates", "Creatives"],
  },
  linkedinLink: {
    type: String,
  },
  // Key-value store of questionId -> answer text captured during registration
  responses: {
    type: Map,
    of: String,
    default: {},
  },
  status: {
    type: String,
    enum: ["active", "shortlisted", "rejected", "holded"],
    default: "active",
  },
  notes: {
    type: String,
    default: "",
  },
  tasks: [{
    title: String,
    description: String,
    deadline: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["assigned", "in_progress", "completed", "overdue"],
      default: "assigned",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
  }],
  lastTaskAssigned: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Consider adding password field if authentication is needed
  // password: {
  //   type: String,
  //   required: true,
  // },
});

const User = mongoose.model("User", userSchema);

export default User;
