import React from "react";

const isReverseProxy = import.meta.env.VITE_REVERSE_PROXY === "true";
const basePath = isReverseProxy ? "/18" : "";

const NotFound = () => {
  return (
    <div className="rounded-lg p-4 border border-gray-200 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <h2 className="text-2xl font-semibold text-cyan-700 pb-3 text-center">Oops! Page not found</h2>
      <div className="flex items-center justify-center">
        <img className="" width={500} src={`${basePath}/404-page.png`} alt="404" />
      </div>
    </div>
  );
};

export default NotFound;
