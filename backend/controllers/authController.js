import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      srmEmail,
      regNo,
      branch,
      yearOfStudy,
      domain,
      linkedinLink,
    } = req.body || {};

    // Basic validation aligned with the User model
    if (!name || !email || !phone || !srmEmail || !regNo || !branch || !yearOfStudy || !domain) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      srmEmail,
      regNo,
      branch,
      yearOfStudy,
      domain,
      linkedinLink,
    });

    return res.status(201).json({
      message: "Registration successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        srmEmail: user.srmEmail,
        regNo: user.regNo,
        branch: user.branch,
        yearOfStudy: user.yearOfStudy,
        domain: user.domain,
        linkedinLink: user.linkedinLink,
      },
    });
  } catch (err) {
    // Handle duplicate key errors and validation errors
    if (err?.code === 11000) {
      const fields = Object.keys(err.keyPattern || {});
      return res.status(409).json({ message: `Duplicate value for: ${fields.join(", ")}` });
    }

    if (err?.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    console.error("Registration error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default { register };
