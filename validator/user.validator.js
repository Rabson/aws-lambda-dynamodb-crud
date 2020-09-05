const Joi = require('@hapi/joi');
module.exports = {
    create: Joi.object({
        fullName: Joi.string().max(20).required(),
        email: Joi.string().email().required(),
    }),
    update: Joi.object({
        id: Joi.string().max(20).required(),
        fullName: Joi.string().max(20).required(),
        email: Joi.string().email().required(),
    }),
    getById: Joi.object({
        id: Joi.string().max(20).required(),
    }),
    delete: Joi.object({
        id: Joi.string().max(20).required(),
    }),
}