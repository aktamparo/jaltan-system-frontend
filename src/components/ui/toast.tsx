"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  IconX,
  IconCheck,
  IconAlertTriangle,
  IconInfoCircle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, "id">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = {
        ...toast,
        id,
        duration: toast.duration ?? 5000,
      };

      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => dismiss(id), newToast.duration);
      }
    },
    [dismiss]
  );

  const success = useCallback(
    (title: string, description?: string) => {
      toast({ type: "success", title, description });
    },
    [toast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      toast({ type: "error", title, description });
    },
    [toast]
  );

  const warning = useCallback(
    (title: string, description?: string) => {
      toast({ type: "warning", title, description });
    },
    [toast]
  );

  const info = useCallback(
    (title: string, description?: string) => {
      toast({ type: "info", title, description });
    },
    [toast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, toast, success, error, warning, info, dismiss }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getIcon = (type: ToastType) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case "success":
        return <IconCheck className={cn(iconClass, "text-green-600")} />;
      case "error":
        return <IconAlertTriangle className={cn(iconClass, "text-red-600")} />;
      case "warning":
        return (
          <IconAlertTriangle className={cn(iconClass, "text-yellow-600")} />
        );
      case "info":
        return <IconInfoCircle className={cn(iconClass, "text-blue-600")} />;
      default:
        return <IconInfoCircle className={cn(iconClass, "text-gray-600")} />;
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-start gap-3 p-4 border rounded-lg shadow-lg backdrop-blur-sm animate-in slide-in-from-right-full",
        getToastStyles(toast.type)
      )}
    >
      <div className="flex-shrink-0">{getIcon(toast.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toast.title}</p>
        {toast.description && (
          <p className="text-sm opacity-90 mt-1">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 ml-2 rounded-md p-1 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        <IconX className="h-4 w-4" />
      </button>
    </div>
  );
};
