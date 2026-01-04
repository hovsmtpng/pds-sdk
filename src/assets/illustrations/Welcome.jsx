import React from "react";

export function WelcomeSVG({
    className = "",
    mode = "light",
    primary = "#6366F1", // indigo-500
    accent = "#06B6D4",  // cyan-500
    auth,
    modules,
    ...props
}) {
    const isDark = mode === "dark";
    const bg1 = isDark ? "#0B1020" : "#F8FAFF";
    const bg2 = isDark ? "#0F172A" : "#EEF2FF";
    const text = isDark ? "#E5E7EB" : "#334155";
    const subtle = isDark ? "#1F2937" : "#E2E8F0";
    const glass = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)";

    return (
        <svg
            className={className}
            viewBox="0 0 960 600"
            role="img"
            aria-labelledby="welcomeTitle"
            {...props}
        >
            <title id="welcomeTitle">Welcome</title>

            <defs>
                {/* Background gradient blobs */}
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={primary} stopOpacity="0.22" />
                    <stop offset="100%" stopColor={accent} stopOpacity="0.12" />
                </linearGradient>
                <linearGradient id="g2" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={primary} stopOpacity="0.10" />
                </linearGradient>

                {/* Shiny header gradient text */}
                <linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={primary} />
                    <stop offset="100%" stopColor={accent} />
                </linearGradient>

                {/* Soft shadow */}
                <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
                    <feOffset dx="0" dy="8" result="offset" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.20" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode in="offset" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Glass effect via mask */}
                <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.4" />
                </linearGradient>
            </defs>

            {/* Background */}
            <rect width="960" height="600" fill={bg1} />
            <rect x="0" y="0" width="960" height="600" fill={bg2} opacity="0.4" />

            {/* Color blobs */}
            <ellipse cx="180" cy="120" rx="220" ry="140" fill="url(#g1)" />
            <ellipse cx="820" cy="520" rx="260" ry="160" fill="url(#g2)" />

            {/* Central glass card */}
            <g filter="url(#softShadow)">
                <rect
                    x="140"
                    y="100"
                    rx="28"
                    ry="28"
                    width="680"
                    height="360"
                    fill={glass}
                    stroke={isDark ? "#334155" : "#E5E7EB"}
                    strokeWidth="1.2"
                />
            </g>

            {/* Header bar */}
            <g transform="translate(170,130)">
                <rect width="620" height="52" rx="14" fill={isDark ? "#0B1220" : "#FFFFFF"} />
                {/* Traffic dots */}
                <circle cx="24" cy="26" r="6" fill="#EF4444" />
                <circle cx="44" cy="26" r="6" fill="#F59E0B" />
                <circle cx="64" cy="26" r="6" fill="#10B981" />
                {/* Title */}
                <text x="96" y="32" fontFamily="Inter, ui-sans-serif" fontSize="18" fill={text}>
                    Control Center
                </text>
            </g>

            {/* Sidebar */}
            <g transform="translate(170,192)">
                <rect width="180" height="236" rx="14" fill={isDark ? "#0E1528" : "#FFFFFF"} />
                {/* Avatar */}
                <circle cx="46" cy="42" r="18" fill={primary} opacity="0.9" />
                <rect x="74" y="28" width="84" height="12" rx="6" fill={subtle} />
                <rect x="74" y="46" width="64" height="10" rx="5" fill={subtle} opacity="0.8" />

                {/* Menu items */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <rect
                        key={i}
                        x="24"
                        y={84 + i * 28}
                        width={i === 0 ? 132 : 116 - (i * 6)}
                        height="14"
                        rx="7"
                        fill={i === 0 ? primary : subtle}
                        opacity={i === 0 ? 0.9 : 1}
                    />
                ))}
            </g>

            {/* Content panel */}
            <g transform="translate(370,192)">
                <rect width="420" height="236" rx="14" fill={isDark ? "#0E1528" : "#FFFFFF"} />

                {/* Welcome text */}
                <text
                    x="24"
                    y="44"
                    fontFamily="Inter, ui-sans-serif"
                    fontSize="28"
                    fontWeight="700"
                    fill="url(#titleGrad)"
                >
                    {auth && auth.username} 👋
                </text>
                <rect x="24" y="60" width="280" height="10" rx="5" fill={subtle} />
                <rect x="24" y="76" width="220" height="10" rx="5" fill={subtle} opacity="0.9" />

                {/* KPI mini-cards */}
                <g transform="translate(24,110)">
                    {[0, 1, 2].map((i) => (
                        <g key={i} transform={`translate(${i * 132}, 0)`} filter="url(#softShadow)">
                            <rect width="120" height="80" rx="12" fill={isDark ? "#0B1220" : "#FFFFFF"} />
                            <rect x="16" y="18" width="40" height="10" rx="5" fill={subtle} />
                            {/* KPI number */}
                            <text
                                x="16"
                                y="50"
                                fontFamily="Inter, ui-sans-serif"
                                fontSize="22"
                                fontWeight="700"
                                fill={text}
                            >
                                {i === 0 ? "128" : i === 1 ? "23" : "98%"}
                            </text>
                            {/* Accent pill */}
                            <rect
                                x="72"
                                y="44"
                                width="32"
                                height="12"
                                rx="6"
                                fill={i === 2 ? accent : primary}
                                opacity="0.9"
                            />
                        </g>
                    ))}
                </g>

                {/* Mini chart (bar) */}
                <g transform="translate(24,210)">
                    {Array.from({ length: 10 }).map((_, i) => {
                        const h = [20, 36, 28, 42, 24, 52, 40, 58, 46, 62][i];
                        return (
                            <rect
                                key={i}
                                x={i * 24}
                                y={70 - h}
                                width="14"
                                height={h}
                                rx="4"
                                fill={i % 3 === 0 ? primary : accent}
                                opacity={0.9}
                            />
                        );
                    })}
                    {/* Axis */}
                    <rect x="0" y="70" width="240" height="3" rx="1.5" fill={subtle} />
                </g>
            </g>

            {/* Character (simple friendly figure) */}
            <g transform="translate(720,168)">
                {/* Body */}
                <path
                    d="M40 110c0-18 12-32 28-32s28 14 28 32v44H40v-44z"
                    fill={primary}
                    opacity="0.9"
                />
                {/* Head */}
                <circle cx="68" cy="68" r="20" fill={isDark ? "#E5E7EB" : "#1F2937"} />
                {/* Hand waving */}
                <path
                    d="M96 122c8-10 22-12 30-4"
                    fill="none"
                    stroke={accent}
                    strokeWidth="6"
                    strokeLinecap="round"
                />
                <path
                    d="M124 118c6 4 10 12 8 18"
                    fill="none"
                    stroke={accent}
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.7"
                />
                {/* Badge */}
                <rect x="54" y="140" width="28" height="10" rx="5" fill="#FFFFFF" opacity="0.8" />
            </g>

            {/* Subtle caption */}
            <text
                x="480"
                y="500"
                textAnchor="middle"
                fontFamily="Inter, ui-sans-serif"
                fontSize="12"
                fill={isDark ? "#94A3B8" : "#64748B"}
            >
                © {new Date().getFullYear()} Puninar Logistics • Admin Panel
            </text>
        </svg>
    );
}

export default WelcomeSVG;
