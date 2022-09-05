"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleErrorMiddleware(error, req, res, next) {
    console.log(error);
    if (error) {
        res.status(error.status).send(error.message);
    }
    res.sendStatus(500);
}
exports.default = handleErrorMiddleware;
