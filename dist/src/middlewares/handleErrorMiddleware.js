"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handleErrorMiddleware(error, req, res, next) {
    if (error.type === 'userError') {
        res.status(error.status).send(error.message);
    }
    else {
        res.sendStatus(500);
    }
}
exports.default = handleErrorMiddleware;
