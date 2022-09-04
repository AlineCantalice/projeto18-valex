import { CardInsertData, findByTypeAndEmployeeId, insert, TransactionTypes } from "../repositories/cardRepository"
import { findByApiKey } from "../repositories/companyRepository"
import { Employee, findById } from "../repositories/employeeRepository"
import { faker } from '@faker-js/faker'
import dayjs from "dayjs"
import Cryptr from 'cryptr'

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

function encryptCVC(cvc: string, cryptr: Cryptr){
    return cryptr.encrypt(cvc);
}

function decryptCVC(encryptedCVC: string, cryptr: Cryptr){
    return cryptr.decrypt(encryptedCVC);
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

export async function activateCardEmployee(cardId: number, cvc: number, password: string) {
    console.log("entrei no service para ativar cartão")
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

export async function existEmployeeById(id: number) {
    return await findById(id);
}

export async function existEmployeeCardType(id: number, type: TransactionTypes) {
    return findByTypeAndEmployeeId(type, id);
}