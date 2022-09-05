import joi from "joi";

const activateSchema = joi.object({
    password: joi.string().regex(/^\d+$/).length(4).required(),
    cvc: joi.string().length(3).required(),
});

export default activateSchema;