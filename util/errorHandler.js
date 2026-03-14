const formatFieldName = (field) => {
  if (!field) {
    return "field";
  }

  return String(field).replace(/_/g, " ");
};

const formatValidationMessage = (error) => {
  const field = formatFieldName(error.path);

  if (error.validatorKey === "isEmail") {
    return `${field} must be a valid email address`;
  }

  if (error.validatorKey === "notNull") {
    return `${field} is required`;
  }

  if (error.validatorKey === "notEmpty") {
    return `${field} cannot be empty`;
  }

  if (error.validatorKey === "min") {
    const minValue = Array.isArray(error.validatorArgs)
      ? error.validatorArgs[0]
      : null;

    if (minValue !== null && minValue !== undefined) {
      return `${field} must be ${minValue} or later`;
    }

    return `${field} is too low`;
  }

  if (error.validatorKey === "max") {
    const maxValue = Array.isArray(error.validatorArgs)
      ? error.validatorArgs[0]
      : null;

    if (maxValue !== null && maxValue !== undefined) {
      return `${field} must be ${maxValue} or earlier`;
    }

    return `${field} is too high`;
  }

  return error.message;
};

const formatSequelizeErrors = (err) => {
  if (Array.isArray(err.errors) && err.errors.length > 0) {
    return err.errors.map((error) => formatValidationMessage(error));
  }

  const message = err.original?.message ?? err.message;
  return [message];
};

const errorHandler = (err, _req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: ["Malformatted id"] });
  }

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError" ||
    err.name === "SequelizeDatabaseError"
  ) {
    return res.status(400).send({ error: formatSequelizeErrors(err) });
  }

  return next(err);
};

module.exports = errorHandler;
