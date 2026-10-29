
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const isProduction = process.env.NODE_ENV === "production";
  const isMalformedJson = err.type === "entity.parse.failed";

  const statusCode = isMalformedJson
    ? 400
    : err.statusCode || err.status || 500;

  let message;

  if (isMalformedJson) {
    message = "Invalid JSON in request body";
  } else if (isProduction) {
    message = "Internal Server Error";
  } else {
    message = err.message || "Internal Server Error";
  }

  return res.status(statusCode).json({ message });
};

module.exports = errorHandler;
