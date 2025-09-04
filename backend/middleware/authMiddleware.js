import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

// Admin authentication middleware
export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    
    // Check if admin still exists and is active
    const admin = await Admin.findById(decoded.adminId).select("-password");
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Invalid token. Admin not found or inactive." });
    }

    req.adminId = decoded.adminId;
    req.adminRole = decoded.role;
    req.adminDomain = decoded.domain;
    req.admin = admin;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Invalid token." });
  }
};

// Super admin authorization middleware
export const requireSuperAdmin = (req, res, next) => {
  if (req.adminRole !== "super_admin") {
    return res.status(403).json({ message: "Access denied. Super admin privileges required." });
  }
  next();
};

// Domain lead authorization middleware
export const requireDomainLead = (req, res, next) => {
  const validRoles = ["super_admin", "creative_lead", "corporate_lead", "technical_lead"];
  if (!validRoles.includes(req.adminRole)) {
    return res.status(403).json({ message: "Access denied. Domain lead privileges required." });
  }
  next();
};

// Specific domain authorization middleware
export const requireSpecificDomain = (domain) => {
  return (req, res, next) => {
    if (req.adminRole === "super_admin") {
      return next(); // Super admin has access to all domains
    }
    
    if (req.adminDomain !== domain) {
      return res.status(403).json({ 
        message: `Access denied. ${domain} domain privileges required.` 
      });
    }
    next();
  };
};

// Creative domain authorization
export const requireCreativeAccess = requireSpecificDomain("creative");

// Corporate domain authorization  
export const requireCorporateAccess = requireSpecificDomain("corporate");

// Technical domain authorization
export const requireTechnicalAccess = requireSpecificDomain("technical");
