// filepath: /src/components/FlameIcon.jsx
import React from "react";
import PropTypes from "prop-types";

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
        <path d="M12 2C10.5 4 8.5 5.5 6 7c-2.5 1.5-4 3.5-4 6.5 0 4.11 3.32 7.5 7.5 7.5 4.11 0 7.5-3.32 7.5-7.5 0-3-1.5-5-4-6.5-2.5-1.5-4.5-3-6-5z" />
    </svg>
);
FlameIcon.propTypes = {
    active: PropTypes.bool.isRequired,
};

export default FlameIcon;
