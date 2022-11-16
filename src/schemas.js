import joi from 'joi'

export const vSingUp = joi.object({
    name: joi.string().required().min(3),
    email: joi.string().email().required(),
    password: joi.string().required().min(3)
})

export const vRecipes = joi.object({
    userId: joi.string().required(),
    type: joi.string().valid('entrada', 'saída').required(),
    value: joi.number().required(),
    date: joi.string().required(),
    description: joi.string().min(3).required()
})