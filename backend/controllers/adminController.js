import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const HARDCODED_ADMINS = [
  {
    usernameEnv: "ADMIN_SUPERADMIN_USERNAME",
    email: "superadmin@hrcc.com",
    passwordEnv: "ADMIN_SUPERADMIN_PASSWORD",
    role: "super_admin",
    domain: null,
  },
  {
    usernameEnv: "ADMIN_CREATIVE_LEAD_USERNAME",
    email: "creative@hrcc.com",
    passwordEnv: "ADMIN_CREATIVE_LEAD_PASSWORD",
    role: "creative_lead",
    domain: "creative",
  },
  {
    usernameEnv: "ADMIN_CORPORATE_LEAD_USERNAME",
    email: "corporate@hrcc.com",
    passwordEnv: "ADMIN_CORPORATE_LEAD_PASSWORD",
    role: "corporate_lead",
    domain: "corporate",
  },
  {
    usernameEnv: "ADMIN_TECHNICAL_LEAD_USERNAME",
    email: "technical@hrcc.com",
    passwordEnv: "ADMIN_TECHNICAL_LEAD_PASSWORD",
    role: "technical_lead",
    domain: "technical",
  },
];

// Initialize hardcoded admins
const initializeAdmins = async () => {
  try {
    for (const adminData of HARDCODED_ADMINS) {
      const envUsername = process.env[adminData.usernameEnv];
      const plainPassword = process.env[adminData.passwordEnv];
      const email = adminData.email;

      if (!envUsername || !plainPassword) {
        console.warn(
          `Skipping creation of admin for role '${adminData.role}' because one or more env vars (${adminData.usernameEnv}, ${adminData.passwordEnv}) are not set.`
        );
        continue;
      }

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({
        $or: [{ username: envUsername }, { email }],
      });

      if (!existingAdmin) {
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        // Create admin
        await Admin.create({
          username: envUsername,
          email,
          password: hashedPassword,
          role: adminData.role,
          domain: adminData.domain,
          isActive: true,
        });

        console.log(`✅ Created admin for role: ${adminData.role}`);
      }
    }
  } catch (error) {
    console.error("Error initializing admins:", error);
  }
};

// Initialize admins on startup
initializeAdmins();

// Generate JWT token
const generateToken = (adminId, role, domain = null) => {
  const payload = { adminId, role };
  if (domain) payload.domain = domain;
  
  return jwt.sign(payload, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "24h",
  });
};

// Admin login
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check hardcoded admins first (usernames/passwords via env, emails hardcoded)
    const matchedAdminConfig = HARDCODED_ADMINS.find((config) => {
      const envUsername = process.env[config.usernameEnv];
      return username === envUsername || username === config.email;
    });

    if (matchedAdminConfig) {
      const envUsername = process.env[matchedAdminConfig.usernameEnv];
      const email = matchedAdminConfig.email;
      const expectedPassword = process.env[matchedAdminConfig.passwordEnv];

      if (expectedPassword && expectedPassword === password) {
        // Find or create the admin in database
        let admin = await Admin.findOne({
          $or: [{ username: envUsername }, { email }],
        });

        if (!admin) {
          // Create admin if not exists
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(expectedPassword, saltRounds);
          
          admin = await Admin.create({
            username: envUsername,
            email,
            password: hashedPassword,
            role: matchedAdminConfig.role,
            domain: matchedAdminConfig.domain,
            isActive: true,
          });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate token
        const token = generateToken(admin._id, admin.role, admin.domain);

        // Return admin data (without password)
        const adminData = {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          domain: admin.domain,
          lastLogin: admin.lastLogin,
        };

        return res.status(200).json({
          message: "Login successful",
          token,
          admin: adminData,
        });
      }
    }

    // Fallback to database lookup for other admins
    const admin = await Admin.findOne({
      $or: [{ username }, { email: username }],
      isActive: true,
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id, admin.role, admin.domain);

    // Return admin data (without password)
    const adminData = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      domain: admin.domain,
      lastLogin: admin.lastLogin,
    };

    res.status(200).json({
      message: "Login successful",
      token,
      admin: adminData,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin profile retrieved successfully",
      admin,
    });
  } catch (error) {
    console.error("Get admin profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Admin logout
export const adminLogout = async (req, res) => {
  try {
    // Since we're using JWT tokens, logout is primarily handled on the client side
    // by removing the token from storage. However, we can add server-side logic here
    // for future enhancements like token blacklisting or session tracking.
    
    const adminId = req.adminId;
    
    if (adminId) {
      // Optional: Update last logout time or add to blacklist
      // For now, we'll just log the logout event
      console.log(`Admin ${adminId} logged out at ${new Date()}`);
    }

    res.status(200).json({
      message: "Logout successful",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  adminLogin,
  getAdminProfile,
  adminLogout,
};
