import { Router } from "express";
import {
  adminLogin,
  getAdminProfile,
  adminLogout,
} from "../controllers/adminController.js";
import {
  authenticateAdmin,
  requireDomainLead,
} from "../middleware/authMiddleware.js";

const router = Router();

// Public routes (no authentication required)
router.post("/login", adminLogin);

// Protected routes (authentication required)
router.get("/profile", authenticateAdmin, getAdminProfile);
router.post("/logout", authenticateAdmin, adminLogout);

// Domain lead routes (super admin + domain leads)
router.get("/domain-lead", authenticateAdmin, requireDomainLead, (req, res) => {
  res.json({
    message: "Domain lead access granted",
    admin: req.admin,
    role: req.adminRole,
    domain: req.adminDomain,
  });
});

export default router;
