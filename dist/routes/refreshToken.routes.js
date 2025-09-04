"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RefreshTokenController_1 = require("../controllers/RefreshTokenController");
const router = (0, express_1.Router)();
router.post('/refresh', RefreshTokenController_1.refreshToken);
router.post('/revoke', RefreshTokenController_1.revokeRefreshToken);
exports.default = router;
