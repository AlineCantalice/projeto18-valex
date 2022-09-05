import joi from 'joi';

const cardSchema = joi.object({
    type: joi.string().required().valid('groceries', 'restaurants', 'transport', 'education', 'health')
});

export default cardSchema;