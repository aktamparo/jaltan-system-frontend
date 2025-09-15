/**
 * Enhanced error handling utility for API operations
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Generic error handler with console logging
 */
export const handleApiError = (error: Error | ApiError, context: string) => {
  console.error(`${context}:`, error);

  // You can replace this with your preferred notification system
  if (typeof window !== "undefined") {
    console.warn(`UI Toast: ${context}: ${error.message}`);
  }
};

/**
 * Success handler
 */
export const handleApiSuccess = (message: string) => {
  console.log(`Success: ${message}`);

  // You can replace this with your preferred notification system
  if (typeof window !== "undefined") {
    console.info(`UI Toast: ${message}`);
  }
};
