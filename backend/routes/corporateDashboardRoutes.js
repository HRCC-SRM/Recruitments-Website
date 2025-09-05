import { Router } from "express";
import {
  getCorporateUsers,
  getCorporateUserById,
  updateUserStatus,
  sendTaskToUsers,
  getCorporateStats,
  bulkUpdateUserStatus,
  getShortlistedUsers,
  sendTaskEmailToShortlisted,
  sendShortlistedEmails,
} from "../controllers/dashboard/corporatesDashboardController.js";
import {
  authenticateAdmin,
  requireSuperAdmin,
  requireCorporateAccess,
} from "../middleware/authMiddleware.js";

const router = Router();

// All routes require authentication and corporate domain access (super admin or corporate lead)
router.use(authenticateAdmin);
router.use((req, res, next) => {
  if (req.adminRole === "super_admin" || req.adminRole === "corporate_lead") {
    next();
  } else {
    return res.status(403).json({ 
      message: "Access denied. Super admin or corporate domain privileges required." 
    });
  }
});

// Get all corporate users with pagination and filters
router.get("/users", getCorporateUsers);

// Get corporate domain statistics
router.get("/stats", getCorporateStats);

// Get single corporate user details
router.get("/users/:userId", getCorporateUserById);

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
