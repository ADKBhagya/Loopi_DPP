import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  createIssueReport,
  createRecyclingRequest,
  createRepairRequest,
  createResaleListing,
  getConsumerDashboard,
  getPublicConsumerPassport,
  verifyConsumerPassport,
} from "../controllers/consumerController.js";

const router = express.Router();

const consumerAccess = [verifyToken, allowRoles("Consumer", "Admin")];

router.get("/passport/:id", getPublicConsumerPassport);
router.get("/verify/:id", consumerAccess, verifyConsumerPassport);
router.get("/dashboard", consumerAccess, getConsumerDashboard);
router.post("/resale", consumerAccess, createResaleListing);
router.post("/repair-requests", consumerAccess, createRepairRequest);
router.post("/recycling-requests", consumerAccess, createRecyclingRequest);
router.post("/issue-reports", consumerAccess, createIssueReport);

export default router;
