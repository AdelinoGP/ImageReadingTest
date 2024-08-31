import Joi from "joi";

export const aboveMaxLimitNumber = Joi.custom((value, helper) => {
  const cached = value;
  const casted = Number(value);
  if (isNaN(casted) || casted <= 0) {
    throw new Error();
  }

  helper.original = cached;
  return cached;
});
