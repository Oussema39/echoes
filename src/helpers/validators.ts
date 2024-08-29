import Joi from "joi";

export const validateEmail = (email: string): Boolean => {
  const emailSchema = Joi.string().email();

  const emailValidation = emailSchema.validate(email);

  return !emailValidation.error;
};

// export const JoiUser = Joi.object({
//   firstName: Joi.string().optional(),
//   lastName: Joi.string().optional(),
//   email: Joi.string().email().required(),
//   password: Joi.string().min(8).required(),
//   age: Joi.number().optional().allow(null, undefined),
// });
