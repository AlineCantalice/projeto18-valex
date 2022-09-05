import joi from "joi";

const blockUnblockSchema = joi.object({
    password: joi.string().regex(/^\d+$/).length(4).required()
});

export default blockUnblockSchema;