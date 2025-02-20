// filepath: /src/components/FlameIcon.jsx
import React from "react";
import PropTypes from "prop-types";

// Renamed to StarIcon but keeping the file name as FlameIcon for compatibility
const FlameIcon = ({ active }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill={active ? "#c9a95c" : "none"}
        stroke={active ? "none" : "#888888"}
        strokeWidth="1.5"
        className={`flame-icon ${active ? "active" : ""}`}
    >
        {/* Star path instead of flame path */}
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
);

FlameIcon.propTypes = {
    active: PropTypes.bool.isRequired,
};

export default FlameIcon;