import { Router } from "express";
import { buy, createRecharge } from "../controllers/transactionsController";

const router = Router();

router.post('/recharge/:cardId', createRecharge);
router.post('buy/:cardId', buy)

export default router;