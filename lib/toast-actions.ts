"use client";

import { useToast } from "@/components/providers/toast-provider";

export function useToastActions() {
  const { success, error, warning, info } = useToast();

  const handleSuccess = (message: string, description?: string) => {
    success(message, description);
  };

  const handleError = (message: string, description?: string) => {
    error(message, description);
  };

  const handleWarning = (message: string, description?: string) => {
    warning(message, description);
  };

  const handleInfo = (message: string, description?: string) => {
    info(message, description);
  };

  const handleFormSubmit = async (
    action: () => Promise<void>,
    successMessage: string,
    errorMessage: string = "An error occurred. Please try again."
  ) => {
    try {
      await action();
      handleSuccess(successMessage);
    } catch (err) {
      console.error("Form submission error:", err);
      handleError(errorMessage);
    }
  };

  const handleAsyncAction = async (
    action: () => Promise<void>,
    successMessage: string,
    errorMessage: string = "An error occurred. Please try again.",
    loadingMessage?: string
  ) => {
    if (loadingMessage) {
      handleInfo(loadingMessage);
    }
    
    try {
      await action();
      handleSuccess(successMessage);
    } catch (err) {
      console.error("Action error:", err);
      handleError(errorMessage);
    }
  };

  return {
    handleSuccess,
    handleError,
    handleWarning,
    handleInfo,
    handleFormSubmit,
    handleAsyncAction,
  };
}
