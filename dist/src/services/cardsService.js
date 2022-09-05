"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.isAuthorizedCVC = exports.isTodayTheExpirationDate = exports.existCardById = exports.existEmployeeCardType = exports.unblock = exports.block = exports.getBalance = exports.activateCardEmployee = exports.createCardEmployee = void 0;
const cardRepository_1 = require("../repositories/cardRepository");
const faker_1 = require("@faker-js/faker");
const dayjs_1 = __importDefault(require("dayjs"));
const cryptr_1 = __importDefault(require("cryptr"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const rechargeService_1 = require("./rechargeService");
const paymentService_1 = require("./paymentService");
function createCardEmployee(employee, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const cardNumber = faker_1.faker.finance.creditCardNumber();
        const fullName = formatName(employee.fullName);
        const expirationDate = generateExpirationDate();
        const cvc = faker_1.faker.finance.creditCardCVV();
        const cryptr = new cryptr_1.default('myTotallySecretKey');
        const encryptedCVC = encryptCVC(cvc, cryptr);
        const cardData = {
            number: cardNumber,
            employeeId: employee.id,
            cardholderName: fullName,
            securityCode: encryptedCVC,
            expirationDate: expirationDate,
            isVirtual: false,
            isBlocked: true,
            type: type
        };
        yield (0, cardRepository_1.insert)(cardData);
    });
}
exports.createCardEmployee = createCardEmployee;
function activateCardEmployee(card, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const hashPassword = encryptPassword(password);
        const cardData = {
            password: hashPassword
        };
        yield (0, cardRepository_1.update)(card.id, cardData);
    });
}
exports.activateCardEmployee = activateCardEmployee;
function getBalance(card) {
    return __awaiter(this, void 0, void 0, function* () {
        const recharges = yield (0, rechargeService_1.getRechargesByCardId)(card.id);
        const transactions = yield (0, paymentService_1.getPaymentsByCardId)(card.id);
        let sumRecharges = 0;
        recharges.forEach(item => {
            sumRecharges += item.amount;
        });
        let sumTransactions = 0;
        transactions.forEach(item => {
            sumTransactions += item.amount;
        });
        const balance = {
            balance: sumRecharges - sumTransactions,
            transactions: transactions,
            recharges: recharges
        };
        return balance;
    });
}
exports.getBalance = getBalance;
function block(card) {
    return __awaiter(this, void 0, void 0, function* () {
        const cardData = {
            isBlocked: true
        };
        yield (0, cardRepository_1.update)(card.id, cardData);
    });
}
exports.block = block;
function unblock(card) {
    return __awaiter(this, void 0, void 0, function* () {
        const cardData = {
            isBlocked: false
        };
        yield (0, cardRepository_1.update)(card.id, cardData);
    });
}
exports.unblock = unblock;
function existEmployeeCardType(id, type) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, cardRepository_1.findByTypeAndEmployeeId)(type, id);
    });
}
exports.existEmployeeCardType = existEmployeeCardType;
function existCardById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, cardRepository_1.findById)(id);
    });
}
exports.existCardById = existCardById;
function isTodayTheExpirationDate(today, expirationDate) {
    return __awaiter(this, void 0, void 0, function* () {
        const expirationMonth = Number(expirationDate.split('/')[0]);
        const expirationYear = Number(expirationDate.split('/')[1]);
        const todayMonth = Number(today.split('/')[0]);
        const todayYear = Number(today.split('/')[1]);
        if (todayYear >= expirationYear && todayMonth >= expirationMonth) {
            return true;
        }
        return false;
    });
}
exports.isTodayTheExpirationDate = isTodayTheExpirationDate;
function isAuthorizedCVC(encryptedCVC, cvc) {
    const cryptr = new cryptr_1.default('myTotallySecretKey');
    if (Number(decryptCVC(encryptedCVC, cryptr)) === cvc) {
        return true;
    }
    return false;
}
exports.isAuthorizedCVC = isAuthorizedCVC;
function verifyPassword(password, hashPassword) {
    return bcrypt_1.default.compareSync(password, hashPassword);
}
exports.verifyPassword = verifyPassword;
function encryptCVC(cvc, cryptr) {
    return cryptr.encrypt(cvc);
}
function decryptCVC(encryptedCVC, cryptr) {
    return cryptr.decrypt(encryptedCVC);
}
function encryptPassword(password) {
    return bcrypt_1.default.hashSync(password, 10);
}
function formatName(fullName) {
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
    return (0, dayjs_1.default)().add(5, 'year').format('MM/YY');
}
