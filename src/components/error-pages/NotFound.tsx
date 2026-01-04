import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageNotFound from "@/assets/svg/error-pages/PageNotFound";

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center min-h-[87vh] overflow-hidden bg-white dark:bg-black">
      {/* Background gradient */}
      <div
        className="absolute bottom-0 right-0 opacity-70 blur-3xl pointer-events-none"
        style={{
          width: "700px",
          height: "400px",
          background:
            "linear-gradient(135deg, hsla(280, 78%, 76%, 1) 0%, hsla(225, 85%, 75%, 1) 100%)",
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-0 py-10 max-w-7xl">
        {/* Illustration */}
        <PageNotFound />

        <h1 className="text-5xl text-gray-800 dark:text-gray-200 mb-2">404</h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Page Not Found
        </p>

        <Button variant="outline" onClick={() => navigate("/")} className="mt-4">
          Go Back Home
        </Button>

        <footer className="mt-10 text-xs text-gray-400 text-center">
          Odong Apps | Copyright © Puninar Logistics 2025
        </footer>
      </div>
    </div>
  );
};
