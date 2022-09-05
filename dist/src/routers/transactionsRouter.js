"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionsController_1 = require("../controllers/transactionsController");
const router = (0, express_1.Router)();
router.post('/recharge/:cardId', transactionsController_1.createRecharge);
router.post('buy/:cardId', transactionsController_1.buy);
exports.default = router;
