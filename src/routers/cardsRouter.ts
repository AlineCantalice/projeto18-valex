import { Router } from "express";
import { activateCard, blockCard, createCard, getCardBalance, getCardByEmployee, unblockCard } from "../controllers/cardsController";

const router = Router();

router.post('/card/:employeeId', createCard);
router.post('/activate/:cardId', activateCard);
//router.get('/card', getCardByEmployee);
router.get('/balance/:cardId', getCardBalance);
router.post('/block', blockCard);
router.post('/unblock', unblockCard);

export default router;