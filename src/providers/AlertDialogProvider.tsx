"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useRef,
} from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

import Lottie from "lottie-react";

import successAnimation from "@/assets/lotties/Success.json";
import warningAnimation from "@/assets/lotties/Warning.json";
import errorAnimation from "@/assets/lotties/Error.json";

/* =====================================================
 * Types
 * ===================================================== */

type DialogType = "success" | "error" | "failed" | "warning" | "primary";
type LottiesType = "success" | "error" | "warning";
type DialogAlign = "center" | "left";

interface DialogActionConfig {
  cancelText?: string | null;
  actionText?: string;
  onConfirm?: () => void;
}

interface DialogLayoutConfig {
  icon?: boolean | ReactNode;
  align?: DialogAlign;
  useLotties?: boolean;
  lottiesIcon?: LottiesType;
  duration?: number;
}

interface DialogState {
  open: boolean;
  type: DialogType;
  title: string;
  description: string;
  actionText: string;
  cancelText: string | null;
  useLotties: boolean;
  lottiesIcon: LottiesType;
  duration?: number;
  align: DialogAlign;
  icon: boolean | ReactNode;
  onConfirm?: () => void;
}

interface DialogContextValue {
  showAlertDialog: (
    type: DialogType,
    title: string,
    description?: string,
    actionConfig?: DialogActionConfig,
    layoutConfig?: DialogLayoutConfig
  ) => void;
  closeDialog: () => void;
}

/* =====================================================
 * Context
 * ===================================================== */

const DialogContext = createContext<DialogContextValue | null>(null);

/* =====================================================
 * Constants
 * ===================================================== */

const ICON_MAP: Record<DialogType, ReactNode> = {
  primary: <Info className="text-primary" size={48} />,
  success: <CheckCircle2 className="text-success" size={48} />,
  warning: <AlertTriangle className="text-warning" size={48} />,
  error: <XCircle className="text-destructive" size={48} />,
  failed: <XCircle className="text-destructive" size={48} />,
};

const ACTION_VARIANT: Record<DialogType, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90",
  success:
    "bg-success text-success-foreground hover:bg-success/90",
  warning:
    "bg-warning text-black hover:bg-warning/90",
  error:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  failed:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

/* =====================================================
 * Provider
 * ===================================================== */

export function AlertDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    type: "primary",
    title: "",
    description: "",
    actionText: "",
    cancelText: null,
    align: "left",
    useLotties: false,
    lottiesIcon: "success",
    icon: false,
    onConfirm: undefined,
  });

  const showAlertDialog = useCallback(
    (
      type: DialogType,
      title: string,
      description = "",
      actionConfig: DialogActionConfig = {},
      layoutConfig: DialogLayoutConfig = {}
    ) => {
      setDialog({
        open: true,
        type,
        title,
        description,
        actionText: actionConfig.actionText ?? "",
        cancelText: actionConfig.cancelText ?? null,
        onConfirm: actionConfig.onConfirm,
        useLotties: layoutConfig.useLotties ?? false,
        lottiesIcon: layoutConfig.lottiesIcon ?? "success",
        duration: layoutConfig.duration,
        align: layoutConfig.align ?? "left",
        icon: layoutConfig.icon ?? false,
      });
    },
    []
  );

  const closeDialog = useCallback(() => {
    setDialog((prev) => ({ ...prev, open: false }));
  }, []);

  const handleConfirm = () => {
    dialog.onConfirm?.();
    closeDialog();
  };

  const renderIcon = () => {
    if (!dialog.icon) return null;
    if (React.isValidElement(dialog.icon)) return dialog.icon;
    return ICON_MAP[dialog.type];
  };

  function renderIconLotties(status: DialogType): ReactNode {
    if (status === "error" || status === "failed") {
      return <Lottie animationData={errorAnimation} loop autoplay style={{ width: 120, height: 120 }} />;
    }

    if (status === "warning") {
      return <Lottie animationData={warningAnimation} loop={false} autoplay style={{ width: 120, height: 120 }} />;
    }

    if (status === "success") {
      return <Lottie animationData={successAnimation} loop={false} autoplay style={{ width: 120, height: 120 }} />;
    }

    return null;
  }

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (dialog.open && dialog.duration && dialog.duration > 0) {
      timerRef.current = setTimeout(() => {
        closeDialog();
      }, dialog.duration);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [dialog.open, dialog.duration, closeDialog]);

  const isCenter = dialog.align === "center";
  const useLotties = dialog.useLotties;

  return (
    <DialogContext.Provider value={{ showAlertDialog, closeDialog }}>
      {children}

      <AlertDialog open={dialog.open} onOpenChange={closeDialog}>
        <AlertDialogContent
          className={`max-w-[420px] ${isCenter ? "text-center" : "text-left"
            }`}
        >
          <AlertDialogHeader
            className={`space-y-3 ${isCenter ? "items-center" : "items-start"
              }`}
          >
            {useLotties ? renderIconLotties(dialog.lottiesIcon) : renderIcon()}

            <AlertDialogTitle className="text-lg font-semibold">
              {dialog.title}
            </AlertDialogTitle>

            {dialog.description && (
              <AlertDialogDescription className="text-sm text-muted-foreground">
                {dialog.description}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>

          <div
            className={`mt-4 flex w-full gap-2 ${isCenter
              ? "justify-between"
              : "justify-end"
              }`}
          >
            {dialog.cancelText && (
              <AlertDialogCancel onClick={closeDialog}>
                {dialog.cancelText}
              </AlertDialogCancel>
            )}

            {dialog.actionText && (
              <AlertDialogAction
                onClick={handleConfirm}
                className={ACTION_VARIANT[dialog.type]}
              >
                {dialog.actionText}
              </AlertDialogAction>
            )}
          </div>

        </AlertDialogContent>
      </AlertDialog>
    </DialogContext.Provider>
  );
}

/* =====================================================
 * Hook
 * ===================================================== */

export const useDialog = (): DialogContextValue => {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error(
      "useDialog must be used within AlertDialogProvider"
    );
  }
  return ctx;
};