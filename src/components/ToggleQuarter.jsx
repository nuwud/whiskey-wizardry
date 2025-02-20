import React, { useState, useEffect } from "react";
import sampleData from "../../public/sampleData.json";
import '../styles/ToggleQuarter.css';

/* 
Design Overview:
- Color Scheme: Deep amber and rich brown tones reminiscent of whiskey.
- Typography: Elegant serif fonts for headings; clean sans-serif for body text.
- Layout: Simple toggle switch with clear labels.
*/

const ToggleQuarter = () => {
    const [currentQuarter, setCurrentQuarter] = useState(sampleData.currentQuarter);

    useEffect(() => {
        fetch("../../public/sampleData.json")
            .then((response) => response.json())
            .then((data) => setCurrentQuarter(data.currentQuarter))
            .catch((err) => console.error("Failed to load sample data:", err));
    }, []);    

    useEffect(() => {
        setCurrentQuarter(sampleData.currentQuarter);
    }, []);

    const handleToggle = (newQuarter) => {
        setCurrentQuarter(newQuarter);
        sampleData.currentQuarter = newQuarter;

        // Save new data (Only works in Node.js, not in browser)
        // This part should be handled by a backend service in a real-world scenario
        // fs.writeFileSync("../data/sampleData.json", JSON.stringify(sampleData, null, 2));
        console.log(`Current quarter is now ${newQuarter}`);
    };

    return (
        <div className="toggle-quarter">
        <h2>Toggle Current Quarter</h2>
        <label>
            <input
            type="checkbox"
            checked={currentQuarter === "Q1"}
            onChange={() => handleToggle(currentQuarter === "Q1" ? "Q2" : "Q1")}
            />
            {currentQuarter === "Q1" ? 'Deactivate' : 'Activate'} Current Quarter
        </label>
        </div>
    );
};

export default ToggleQuarter;