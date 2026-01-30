import type { AxiosErrorType, ApiError } from "./api-error-types";

// For fetch error handling dari zod schema validation
export const handleApiError = (errorData: ApiError): string => {
  // Handle validation errors (array of errors)
  if (errorData.errors && Array.isArray(errorData.errors)) {
    const validationMessages = errorData.errors
      .map((error) => error.message)
      .join(", ");
    return validationMessages;
  }

  // Handle general error message
  return errorData.message || "Terjadi kesalahan. Silakan coba lagi.";
};

// Parse fetch Response error
export const parseApiError = async (response: Response): Promise<string> => {
  try {
    const errorData: ApiError = await response.json();
    return handleApiError(errorData);
  } catch {
    // Fallback if response cannot be parsed
    return response.statusText || "Terjadi kesalahan. Silakan coba lagi.";
  }
};

// For axios error handling
export const handleAxiosError = (error: AxiosErrorType): string => {
  // Handle axios error response
  if (error.response?.data) {
    const errorData: ApiError = error.response.data;
    return handleApiError(errorData);
  }

  // Handle network errors
  if (error.code === "ECONNABORTED") {
    return "Request timeout. Silakan coba lagi.";
  }

  if (error.message === "Network Error") {
    return "Tidak dapat terhubung ke server. Silakan cek koneksi internet Anda.";
  }

  // Fallback
  return error.message || "Terjadi kesalahan. Silakan coba lagi.";
};
