import React from "react";
import { Button } from "@/components/ui/button";

export const UnderMaintenance: React.FC = () => {
    const handleRefresh = (): void => {
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[84vh] mt-1 bg-gray-100 dark:bg-zinc-900 text-center px-4">
            <img
                src="https://cdn-icons-png.flaticon.com/512/595/595067.png"
                alt="Maintenance"
                className="w-32 h-32 mb-6"
            />

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                🚧 Under Maintenance
            </h1>

            <p className="text-gray-600 dark:text-white mb-6 max-w-md">
                Maaf, halaman ini sedang dalam perbaikan. Silakan kembali lagi nanti.
            </p>

            <Button
                variant="primary"
                onClick={handleRefresh}
                className="px-6 py-2 rounded-lg transition"
            >
                Refresh
            </Button>
        </div>
    );
};

export default UnderMaintenance;