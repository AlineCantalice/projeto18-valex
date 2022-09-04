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
exports.existEmployeeCardType = exports.existEmployeeById = exports.existCompanyByApiKey = exports.unblock = exports.block = exports.getBalance = exports.getAllCards = exports.activateCardEmployee = exports.createCardEmployee = void 0;
const cardRepository_1 = require("../repositories/cardRepository");
const companyRepository_1 = require("../repositories/companyRepository");
const employeeRepository_1 = require("../repositories/employeeRepository");
const faker_1 = require("@faker-js/faker");
const dayjs_1 = __importDefault(require("dayjs"));
const cryptr_1 = __importDefault(require("cryptr"));
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
function encryptCVC(cvc, cryptr) {
    return cryptr.encrypt(cvc);
}
function decryptCVC(encryptedCVC, cryptr) {
    return cryptr.decrypt(encryptedCVC);
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
function activateCardEmployee(cardId, cvc, password) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entrei no service para ativar cartão");
    });
}
exports.activateCardEmployee = activateCardEmployee;
function getAllCards(employeeId, cards) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entrei no service para buscar cartão " + cards[0]['password']);
    });
}
exports.getAllCards = getAllCards;
function getBalance(cardId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entrei no service para buscar extrato do cartão");
    });
}
exports.getBalance = getBalance;
function block(cardId, password) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entrei no service para bloquear cartão");
    });
}
exports.block = block;
function unblock(cardId, password) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("entrei no service para desbloquear cartão");
    });
}
exports.unblock = unblock;
function existCompanyByApiKey(apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, companyRepository_1.findByApiKey)(apiKey);
    });
}
exports.existCompanyByApiKey = existCompanyByApiKey;
function existEmployeeById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, employeeRepository_1.findById)(id);
    });
}
exports.existEmployeeById = existEmployeeById;
function existEmployeeCardType(id, type) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, cardRepository_1.findByTypeAndEmployeeId)(type, id);
    });
}
exports.existEmployeeCardType = existEmployeeCardType;
