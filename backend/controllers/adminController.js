import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Hardcoded admin accounts
const HARDCODED_ADMINS = [
  {
    username: "superadmin",
    email: "superadmin@hrcc.com",
    password: "admin123",
    role: "super_admin",
    domain: null,
  },
  {
    username: "creative_lead",
    email: "creative@hrcc.com", 
    password: "creative123",
    role: "creative_lead",
    domain: "creative",
  },
  {
    username: "corporate_lead",
    email: "corporate@hrcc.com",
    password: "corporate123", 
    role: "corporate_lead",
    domain: "corporate",
  },
  {
    username: "technical_lead",
    email: "technical@hrcc.com",
    password: "technical123",
    role: "technical_lead", 
    domain: "technical",
  },
];

// Initialize hardcoded admins
const initializeAdmins = async () => {
  try {
    for (const adminData of HARDCODED_ADMINS) {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({
        $or: [{ username: adminData.username }, { email: adminData.email }],
      });

      if (!existingAdmin) {
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

        // Create admin
        await Admin.create({
          username: adminData.username,
          email: adminData.email,
          password: hashedPassword,
          role: adminData.role,
          domain: adminData.domain,
          isActive: true,
        });

        console.log(`✅ Created admin: ${adminData.username} (${adminData.role})`);
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

    // Check hardcoded admins first
    const hardcodedAdmin = HARDCODED_ADMINS.find(
      admin => admin.username === username || admin.email === username
    );

    if (hardcodedAdmin && hardcodedAdmin.password === password) {
      // Find or create the admin in database
      let admin = await Admin.findOne({
        $or: [{ username: hardcodedAdmin.username }, { email: hardcodedAdmin.email }],
      });

      if (!admin) {
        // Create admin if not exists
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(hardcodedAdmin.password, saltRounds);
        
        admin = await Admin.create({
          username: hardcodedAdmin.username,
          email: hardcodedAdmin.email,
          password: hashedPassword,
          role: hardcodedAdmin.role,
          domain: hardcodedAdmin.domain,
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
