import { Router } from "express";
import {
  getTechnicalUsers,
  getTechnicalUserById,
  updateUserStatus,
  sendTaskToUsers,
  getTechnicalStats,
  bulkUpdateUserStatus,
  getShortlistedUsers,
  sendTaskEmailToShortlisted,
} from "../controllers/dashboard/technicalDasboardController.js";
import {
  authenticateAdmin,
  requireSuperAdmin,
  requireTechnicalAccess,
} from "../middleware/authMiddleware.js";

const router = Router();

// All routes require authentication and technical domain access (super admin or technical lead)
router.use(authenticateAdmin);
router.use((req, res, next) => {
  if (req.adminRole === "super_admin" || req.adminRole === "technical_lead") {
    next();
  } else {
    return res.status(403).json({ 
      message: "Access denied. Super admin or technical domain privileges required." 
    });
  }
});

// Get all technical users with pagination and filters
router.get("/users", getTechnicalUsers);

// Get technical domain statistics
router.get("/stats", getTechnicalStats);

// Get single technical user details
router.get("/users/:userId", getTechnicalUserById);

// Update single user status
router.patch("/users/:userId/status", updateUserStatus);

// Bulk update user status
router.patch("/users/bulk-status", bulkUpdateUserStatus);

// Send task to multiple users
router.post("/tasks/send", sendTaskToUsers);

// Get shortlisted users
router.get("/shortlisted", getShortlistedUsers);

// Send task email to all shortlisted users
router.post("/tasks/send-to-shortlisted", sendTaskEmailToShortlisted);

export default router;
