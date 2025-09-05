import { Router } from "express";
import {
  getCreativeUsers,
  getCreativeUserById,
  updateUserStatus,
  sendTaskToUsers,
  getCreativeStats,
  bulkUpdateUserStatus,
  getShortlistedUsers,
  sendTaskEmailToShortlisted,
  sendShortlistedEmails,
} from "../controllers/dashboard/creativeDashboardController.js";
import {
  authenticateAdmin,
  requireSuperAdmin,
  requireCreativeAccess,
} from "../middleware/authMiddleware.js";

const router = Router();

// All routes require authentication and creative domain access (super admin or creative lead)
router.use(authenticateAdmin);
router.use((req, res, next) => {
  if (req.adminRole === "super_admin" || req.adminRole === "creative_lead") {
    next();
  } else {
    return res.status(403).json({ 
      message: "Access denied. Super admin or creative domain privileges required." 
    });
  }
});

// Get all creative users with pagination and filters
router.get("/users", getCreativeUsers);

// Get creative domain statistics
router.get("/stats", getCreativeStats);

// Get single creative user details
router.get("/users/:userId", getCreativeUserById);

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

// Send shortlisted notification emails (HTML template)
router.post("/notifications/send-to-shortlisted", sendShortlistedEmails);

export default router;
