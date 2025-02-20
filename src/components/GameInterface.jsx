import React, { useState, useEffect } from "react";
import SliderInput from "./SliderInput.jsx";
import "../styles/GameInterface.css";

/* 
Design Overview:
- Color Scheme: Deep amber and rich brown tones reminiscent of whiskey.
- Typography: Elegant serif fonts for headings; clean sans-serif for body text.
- Layout: Card-based design with subtle shadows; ample whitespace for a refined look.
- Imagery: High-resolution images of whiskey bottles and barrels.
*/

const GameInterface = () => {
    const [sampleData, setSampleData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Fetching sample data...");
        fetch("/sampleData.json")
        .then((response) => {
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Sample Data Loaded:", data);
            setSampleData(data);
        })
        .catch((error) => {
            console.error("Error loading sample data:", error);
            setError("Failed to load sample data.");
        });
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    if (!sampleData) {
        return <div>Loading sample data...</div>;
    }

    const currentQuarter = sampleData.currentQuarter;
    const samples = sampleData?.quarters[currentQuarter]?.samples || [];

    const handleInputChange = (index, field, value) => {
        const updatedSamples = [...samples];
        updatedSamples[index][field] = value;
        setSampleData({ ...sampleData, quarters: { ...sampleData.quarters, [currentQuarter]: { samples: updatedSamples } } });
    };

    const handleSubmit = () => {
        console.log("Submitted guesses:", samples);
    };

    return (
        <div className="game-interface">
        {samples.map((sample, index) => (
            <div key={index} className="sample-card">
            <h3>Sample {sample.label}</h3>
            <SliderInput
                min={1}
                max={10}
                step={1}
                value={sample.age}
                onChange={(e) => handleInputChange(index, "age", parseInt(e.target.value))}
                label="Age Statement"
            />
            <SliderInput
                min={80}
                max={120}
                step={1}
                value={sample.proof}
                onChange={(e) => handleInputChange(index, "proof", parseInt(e.target.value))}
                label="Proof"
            />
            <label>
                Mashbill:
                <select
                value={sample.mashbill}
                onChange={(e) => handleInputChange(index, "mashbill", e.target.value)}
                >
                <option value="Bourbon">Bourbon</option>
                <option value="Rye">Rye</option>
                <option value="Single Malt">Single Malt</option>
                <option value="Wheat">Wheat</option>
                <option value="Other">Other</option>
                </select>
            </label>
            <label>
                Rating:
                <input
                type="number"
                min="0"
                max="5"
                value={sample.rating}
                onChange={(e) => handleInputChange(index, "rating", parseInt(e.target.value))}
                />
            </label>
            </div>
        ))}
        <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default GameInterface;