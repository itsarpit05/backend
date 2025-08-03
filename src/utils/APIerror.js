// Create a custom error class named ApiError
// It extends the built-in Error class in JavaScript
class ApiError extends Error {
    
  // The constructor is called when we create a new ApiError
  constructor(
      statusCode,                          // The HTTP status code (e.g. 400, 404, 500)
      message = "Something went wrong",    // A default error message if none is provided
      errors = [],                         // Optional: An array to hold additional error details (e.g., validation errors)
      stack = ""                           // Optional: A manually passed stack trace
  ) {
      // Call the constructor of the built-in Error class with the message
      super(message);

      // Set the status code (e.g., 404 Not Found, 500 Server Error)
      this.statusCode = statusCode;

      // Optional: You can attach extra data here later if needed. Initially null.
      this.data = null;

      // Set the error message (already done in super, but repeating here)
      this.message = message;

      // This tells the frontend that this operation failed
      this.success = false;

      // Attach any extra error details (e.g., validation failures)
      this.errors = errors;

      // If a custom stack trace was passed, use it
      if (stack) {
          this.stack = stack;
      } else {
          // Otherwise, generate the stack trace automatically
          // This shows where the error actually occurred in the code
          Error.captureStackTrace(this, this.constructor);
      }
  }
}

// Export the ApiError class so it can be imported in other files
export { ApiError };
