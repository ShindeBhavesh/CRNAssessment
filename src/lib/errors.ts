import axios from "axios";

export const extractErrorMessage = (error: unknown, fallback = "Request failed") => {
  if (axios.isAxiosError(error)) {
    const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;
    return apiMessage ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
