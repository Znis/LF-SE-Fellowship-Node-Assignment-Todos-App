import joi from "joi";

export const createOrUpdateTodoBodySchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  completed: joi.boolean().required(),
  dueDate: joi.string().required(),
  priority: joi.string().valid("High", "Medium", "Low").required(),
  category: joi.string().required().options({
    stripUnknown: true,
  }),
});

export const updateOrdeleteTodoQuerySchema = joi
  .object({
    id: joi.number().required().messages({
      "number.base": "id must be a number",
    }),
  })
  .options({
    stripUnknown: true,
  });
