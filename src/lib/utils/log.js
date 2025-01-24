export function logError(message, error, details = {}) {
  console.error(message, error, details);
  // In a production environment, you would replace console.error with a logging service
  // Example:
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, {
  //     extra: {
  //       message,
  //       details,
  //     },
  //   });
  // }
}
