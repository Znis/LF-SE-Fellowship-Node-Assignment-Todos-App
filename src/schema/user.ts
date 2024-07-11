import joi from "joi";

export const userSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
});

export const getUserQuerySchema = joi
  .object({
    q: joi.string().optional(),

    page: joi.number().optional().messages({
      "number.base": "page must be a number",
    }),
  })
  .options({
    stripUnknown: true,
  });

export const createUserBodySchema = joi.object({
  name: joi.string().required().messages({
    "any.required": "Name is required",
  }),

  email: joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be valid format",
  }),

  password: joi
    .string()
    .required()
    .min(8)
    .messages({
      "any.required": "password is required",
      "string.min": "Password must be at least 8 characters",
      "password.uppercase":
        "Password must have at least one uppercase character",
      "password.lowercase":
        "Password must have at least one lowercase character",
      "password.special": "Password must have at least one special character",
    })
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error("password.uppercase");
      }
      if (!/[a-z]/.test(value)) {
        return helpers.error("password.lowercase");
      }
      if (!/[!@#$%^&*()_+]/.test(value)) {
        return helpers.error("password.special");
      }

      return value;
    })
    .options({
      stripUnknown: true,
    }),
});
