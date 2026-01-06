import React from "react";

export const NoMenuAvailable: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full w-full px-6">
      <svg
        role="img"
        aria-hidden={false}
        width="240"
        height="160"
        viewBox="0 0 240 160"
        className="mb-6 max-w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>No menus available</title>
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0" stopColor="#c7ddff" />
            <stop offset="1" stopColor="#e9f2ff" />
          </linearGradient>
        </defs>

        {/* background card */}
        <rect x="8" y="16" width="224" height="112" rx="12" fill="url(#g1)" />

        {/* simple menu icon (three lines) */}
        <g transform="translate(36, 46)" fill="#3b82f6">
          <rect x="0" y="0" width="120" height="8" rx="4" opacity="0.95" />
          <rect x="0" y="22" width="90" height="8" rx="4" opacity="0.9" />
          <rect x="0" y="44" width="60" height="8" rx="4" opacity="0.85" />
        </g>

        {/* decorative circle */}
        <circle cx="180" cy="44" r="18" fill="#60a5fa" opacity="0.12" />
        <circle cx="180" cy="110" r="12" fill="#60a5fa" opacity="0.08" />

        {/* small person avatar shape */}
        <g transform="translate(160, 18)" fill="#1e293b" opacity="0.7">
          <circle cx="12" cy="18" r="10" />
          <rect x="4" y="34" width="16" height="10" rx="5" />
        </g>
      </svg>

      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        Menu tidak tersedia
      </h3>
      <p className="text-sm text-slate-500 max-w-xs">
        Pilih role atau hubungi administrator untuk mengaktifkan akses ke menu.
      </p>
    </div>
  );
};

export default NoMenuAvailable;