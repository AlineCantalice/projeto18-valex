import { Router } from "express";
import { activateCard, blockCard, createCard, getCardBalance, getCardByEmployee, unblockCard } from "../controllers/cardsController";

const router = Router();

router.post('/card/:employeeId', createCard);
router.post('/activate', activateCard);
router.get('/card', getCardByEmployee);
router.get('/balance', getCardBalance);
router.post('/block', blockCard);
router.post('/unblock', unblockCard);

export default router;