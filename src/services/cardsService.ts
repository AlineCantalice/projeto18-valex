import { CardInsertData, findByTypeAndEmployeeId, insert, TransactionTypes, findById, Card, CardUpdateData, update } from "../repositories/cardRepository"
import { findByApiKey } from "../repositories/companyRepository"
import { Employee } from "../repositories/employeeRepository"
import { faker } from '@faker-js/faker'
import dayjs from "dayjs"
import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'
import { getRechargesByCardId } from "./rechargeService"
import { getPaymentsByCardId } from "./paymentService"
import { Recharge } from "../repositories/rechargeRepository"
import { Payment } from "../repositories/paymentRepository"

export async function createCardEmployee(employee: Employee, type: TransactionTypes) {
    const cardNumber = faker.finance.creditCardNumber();
    const fullName = formatName(employee.fullName);
    const expirationDate = generateExpirationDate();
    const cvc = faker.finance.creditCardCVV();
    const cryptr = new Cryptr('myTotallySecretKey');
    const encryptedCVC = encryptCVC(cvc, cryptr);

    const cardData: CardInsertData = {
        number: cardNumber,
        employeeId: employee.id,
        cardholderName: fullName,
        securityCode: encryptedCVC,
        expirationDate: expirationDate,
        isVirtual: false,
        isBlocked: true,
        type: type
    }

    await insert(cardData);
}

export async function activateCardEmployee(card: Card, password: string) {
    const hashPassword = encryptPassword(password);

    const cardData: CardUpdateData = {
        password: hashPassword
    }

    await update(card.id, cardData);
}

export async function getBalance(card: Card) {
    const recharges: Recharge[] = await getRechargesByCardId(card.id);
    const transactions: Payment[] = await getPaymentsByCardId(card.id);

    let sumRecharges: number = 0;
    
    recharges.forEach(item => {
        sumRecharges += item.amount;
    });

    let sumTransactions: number = 0;

    transactions.forEach(item => {
        sumTransactions += item.amount;
    });

    const balance = {
        balance: sumRecharges - sumTransactions,
        transactions: transactions,
        recharges: recharges
    }

    return balance;
}

export async function block(card: Card) {
    const cardData: CardUpdateData = {
        isBlocked: true
    }
    await update(card.id, cardData);
}

export async function unblock(card: Card) {
    const cardData: CardUpdateData = {
        isBlocked: false
    }
    await update(card.id, cardData);
}

export async function existEmployeeCardType(id: number, type: TransactionTypes) {
    return await findByTypeAndEmployeeId(type, id);
}

export async function existCardById(id: number) {
    return await findById(id);
}

export async function isTodayTheExpirationDate(today: string, expirationDate: string) {
    const expirationMonth = Number(expirationDate.split('/')[0]);
    const expirationYear = Number(expirationDate.split('/')[1]);
    const todayMonth = Number(today.split('/')[0]);
    const todayYear = Number(today.split('/')[1]);

    if (todayYear >= expirationYear && todayMonth >= expirationMonth) {
        return true;
    }
    return false;
}

export function isAuthorizedCVC(encryptedCVC: string, cvc: number) {
    const cryptr = new Cryptr('myTotallySecretKey');
    if (Number(decryptCVC(encryptedCVC, cryptr)) === cvc) {
        return true;
    }
    return false;
}

export function verifyPassword(password: string, hashPassword: string){
    return bcrypt.compareSync(password, hashPassword);
}

function encryptCVC(cvc: string, cryptr: Cryptr) {
    return cryptr.encrypt(cvc);
}

function decryptCVC(encryptedCVC: string, cryptr: Cryptr) {
    return cryptr.decrypt(encryptedCVC);
}

function encryptPassword(password: string) {
    return bcrypt.hashSync(password, 10);
}

function formatName(fullName: string) {
    let newName = fullName.split(" ");
    let result = newName[0];
    for (let i = 1; i < newName.length - 1; i++) {
        if (newName[i].length >= 3) {
            result += " ";
            result += newName[i][0];
        }
    }
    result += " ";
    result += newName[newName.length - 1];
    return result.toUpperCase();
}

function generateExpirationDate() {
    return dayjs().add(5, 'year').format('MM/YY');
}
