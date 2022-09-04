import { CardInsertData, findByTypeAndEmployeeId, insert, TransactionTypes, findById, Card, CardUpdateData, update } from "../repositories/cardRepository"
import { findByApiKey } from "../repositories/companyRepository"
import { Employee } from "../repositories/employeeRepository"
import { faker } from '@faker-js/faker'
import dayjs from "dayjs"
import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

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

export async function getAllCards(employeeId: number, cards: {}[]) {
    console.log("entrei no service para buscar cartão " + cards[0]['password'])
}

export async function getBalance(cardId: number) {
    console.log("entrei no service para buscar extrato do cartão")
}

export async function block(cardId: number, password: string) {
    console.log("entrei no service para bloquear cartão")
}

export async function unblock(cardId: number, password: string) {
    console.log("entrei no service para desbloquear cartão")
}

export async function existCompanyByApiKey(apiKey: string) {
    return await findByApiKey(apiKey);
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

    if(todayYear >= expirationYear && todayMonth >= expirationMonth){
        return true;
    }
    return false;
}

export function isAuthorizedCVC(encryptedCVC: string, cvc: number) {
    const cryptr = new Cryptr('myTotallySecretKey');
    if(Number(decryptCVC(encryptedCVC, cryptr)) === cvc){
        return true;
    }
    return false;
}

function encryptCVC(cvc: string, cryptr: Cryptr){
    return cryptr.encrypt(cvc);
}

function decryptCVC(encryptedCVC: string, cryptr: Cryptr){
    return cryptr.decrypt(encryptedCVC);
}

function encryptPassword(password: string){
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