import joi from "joi";

export const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
});


export const getUserQuerySchema = joi.object({
        q: joi.string().optional(),
   
        page: joi.number().optional().messages({
             "number.base": "page must be a number",
        }),
   }).options({
        stripUnknown: true,
   });
