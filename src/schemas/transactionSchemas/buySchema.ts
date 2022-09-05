import joi from 'joi'

const buySchema = joi.object({
    password: joi.string().regex(/^\d+$/).length(4).required(),
    businessId: joi.number().positive().required(),
    amount: joi.number().integer().positive().min(1).required()
});

export default buySchema;