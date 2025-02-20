import React from "react";
import "../styles/ToggleQuarter.css";

// Set the current quarter manually (or load from sampleData.json if needed)
const CURRENT_QUARTER = "Q4-2024";  // Change this when building for a new quarter

const ToggleQuarter = () => {
    return (
        <div className="toggle-quarter">
            <h2>Current Game: {CURRENT_QUARTER}</h2>
        </div>
    );
};

export default ToggleQuarter;
