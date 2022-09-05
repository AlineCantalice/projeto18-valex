"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateSchema(schema) {
    return (req, res, next) => {
        const validation = schema.validate(req.body);
        if (validation.error) {
            throw {
                status: 422,
                message: validation.error.details
            };
        }
        next();
    };
}
exports.default = validateSchema;
