import joi from "joi";

export const getTodosSchema = joi.object({
  page: joi
    .number()
    .min(1)
    .optional()
    .messages({
      "number.base": "page must be a number",
      "number.min": "page must be greater than or equal to 1",
    })
    .default(1),
  size: joi
    .number()
    .min(1)
    .max(10)
    .optional()
    .messages({
      "number.base": "Size must be a number",
      "number.min": "Size must be greater than or equal to 1",
      "number.max": "Size must be less than or equal to 10",
    })
    .default(10),
});
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

export const updateOrDeleteTodoQuerySchema = joi
  .object({
    id: joi
      .string()
      .custom((value, helpers) => {
        if (!/^\d+$/.test(value)) {
          return helpers.error("string.pattern.base", { value });
        }
        return value;
      })
      .required()
      .messages({
        "string.base": "id must be a string",
        "string.pattern.base": "id must be a string representing a number",
        "any.required": "id is a required field",
      }),
  })
  .options({
    stripUnknown: true,
  });
