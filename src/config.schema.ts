import * as Joi from 'Joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000).required(),
  DB_PORT: Joi.number().default(27017).required(),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
});
