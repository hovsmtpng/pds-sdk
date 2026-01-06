"use client";

import React, {
    createContext,
    useContext,
    useCallback,
    ReactNode,
} from "react";
import { toast } from "sonner";
import { Alert, AlertIcon, AlertTitle } from "@/components/ui/alert";
import {
    RiCheckboxCircleFill,
    RiErrorWarningFill,
    RiSpam3Fill,
    RiInformationFill,
} from "@remixicon/react";

/* ==============================
 * Types
 * ============================== */

export type ToastType =
    | "success"
    | "info"
    | "warning"
    | "destructive";

interface ToastContextValue {
    showToast: (
        type: ToastType,
        message: string,
        duration?: number
    ) => void;
}

interface ToastProviderProps {
    children: ReactNode;
}

/* ==============================
 * Context
 * ============================== */

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/* ==============================
 * Provider
 * ============================== */

export function ToastProvider({ children }: ToastProviderProps) {
    const showToast = useCallback<
        ToastContextValue["showToast"]
    >((type, message, duration = 5000) => {
        const icons: Record<ToastType, ReactNode> = {
            success: <RiCheckboxCircleFill className="text-success" />,
            info: <RiInformationFill className="text-info" />,
            warning: <RiSpam3Fill className="text-warning" />,
            destructive: <RiErrorWarningFill className="text-destructive" />,
        };

        toast.custom(
            (t) => (
                <Alert
                    // variant="mono"
                    icon={type}
                    onClose={() => toast.dismiss(t)}
                    className="flex items-center gap-2"
                >
                    <AlertIcon>{icons[type]}</AlertIcon>
                    <AlertTitle>{message}</AlertTitle>
                </Alert>
            ),
            {
                duration,
                position: "top-right",
            }
        );
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
        </ToastContext.Provider>
    );
}

/* ==============================
 * Hook
 * ============================== */

export const useToast = (): ToastContextValue => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return context;
};