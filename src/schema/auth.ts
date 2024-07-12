import joi from "joi";

const minPasswordLength = 4;

export const loginBodySchema = joi.object({
  email: joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Email must be valid format",
  }),

  password: joi
    .string()
    .required()
    .min(minPasswordLength)
    .messages({
      "any.required": "password is required",
      "string.min": "Password must be at least 4 characters",
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
