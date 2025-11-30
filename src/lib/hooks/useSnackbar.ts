import { useState, useCallback } from "react";
import { UseSnackbarReturn, SnackbarSeverity } from "@/lib/types/hooks.types";

/**
 * Хук для управления Snackbar уведомлениями
 * 
 * @returns Объект с состоянием и методами для управления snackbar
 */
export const useSnackbar = (): UseSnackbarReturn => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<SnackbarSeverity>("error");

  const show = useCallback((msg: string, sev: SnackbarSeverity) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    open,
    message,
    severity,
    show,
    close,
  };
};

