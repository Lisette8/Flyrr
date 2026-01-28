import React from 'react';

// Minimal SVG Icons (Lucide-style)
const icons = {
    plane: "M2 12h20M2 12l5-5m-5 5l5 5M12 2l-2 5h4l-2-5M12 22l-2-5h4l-2 5", // Simplified abstract plane/direction
    globe: "M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z",
    users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
    chart: "M12 20V10 M18 20V4 M6 20v-4",
    arrowRight: "M5 12h14 M12 5l7 7-7 7",
    check: "M20 6 9 17l-5-5",
    menu: "M4 12h16 M4 6h16 M4 18h16",
    x: "M18 6 6 18 M6 6l12 12",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
};

const Icon = ({ name, size = 24, className = '', strokeWidth = 2 }) => {
    const path = icons[name];
    if (!path) return null;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d={path} />
        </svg>
    );
};

export default Icon;
