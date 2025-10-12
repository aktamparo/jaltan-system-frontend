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

interface ToastInterface {
  error: (title: string, description?: string) => void;
  success: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

/**
 * Generic error handler with toast notifications
 */
export const handleApiError = (
  error: Error | ApiError,
  context: string,
  toast?: ToastInterface
) => {
  console.error(`${context}:`, error);

  if (toast && typeof window !== "undefined") {
    toast.error(context, error.message);
  }
};

/**
 * Success handler with toast notifications
 */
export const handleApiSuccess = (message: string, toast?: ToastInterface) => {
  console.log(`Success: ${message}`);

  if (toast && typeof window !== "undefined") {
    toast.success("Success", message);
  }
};
