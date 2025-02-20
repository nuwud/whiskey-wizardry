import React, { useState, useEffect } from "react";
import SliderInput from "./SliderInput.jsx";
import "../styles/GameInterface.css";
import ResultsPage from "./ResultsPage.jsx";
import FlameIcon from "./FlameIcon.jsx";

const GameInterface = () => {
    const [sampleData, setSampleData] = useState(null);
    const [error, setError] = useState(null);
    const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
    const [submittedAnswers, setSubmittedAnswers] = useState(false);
    const [scores, setScores] = useState({
        totalScore: 0,
        sampleScores: [],
    });

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
            // Initialize sample data with default values
            const initializedSamples = data.quarters[
            data.currentQuarter
            ].samples.map((sample) => ({
            ...sample,
            userAge: 1,
            userProof: 80,
            userMashbill: "",
            userRating: 0,
            score: 0,
            }));

            setSampleData({
            ...data,
            quarters: {
                ...data.quarters,
                [data.currentQuarter]: {
                ...data.quarters[data.currentQuarter],
                samples: initializedSamples,
                },
            },
            });
        })
        .catch((error) => {
            console.error("Error loading sample data:", error);
            setError("Failed to load sample data.");
        });
    }, []);

    const goToNextSample = () => {
        if (currentSampleIndex < samples.length - 1) {
        setCurrentSampleIndex(currentSampleIndex + 1);
        }
    };

    const goToPreviousSample = () => {
        if (currentSampleIndex > 0) {
        setCurrentSampleIndex(currentSampleIndex - 1);
        }
    };

    const goToSample = (index) => {
        if (index >= 0 && index < samples.length) {
        setCurrentSampleIndex(index);
        }
    };

    // Updated input handler to store user inputs separately
    const handleInputChange = (index, field, value) => {
        const updatedSamples = [...samples];
        updatedSamples[index][
        `user${field.charAt(0).toUpperCase() + field.slice(1)}`
        ] = value;

        setSampleData({
        ...sampleData,
        quarters: {
            ...sampleData.quarters,
            [currentQuarter]: {
            ...sampleData.quarters[currentQuarter],
            samples: updatedSamples,
            },
        },
        });
    };

    // Calculate scores based on user answers
    const calculateScores = () => {
        const sampleScores = samples.map((sample) => {
        // Initialize score components
        let ageScore = 0;
        let proofScore = 0;
        let mashbillScore = 0;

        // Mashbill score - 30 points if correct, 0 if incorrect
        if (sample.userMashbill === sample.mashbill) {
            mashbillScore = 30;
        }

        // Age score calculation
        const ageDifference = Math.abs(sample.age - (sample.userAge || 0));
        if (ageDifference === 0) {
            ageScore = 35; // Perfect match
        } else if (ageDifference === 1) {
            ageScore = 30; // 1 year off
        } else if (ageDifference < 6) {
            // For differences 2-5 years, subtract 6 points per year from 30
            ageScore = Math.max(0, 30 - (ageDifference - 1) * 6);
        } else {
            ageScore = 0; // 6+ years off gets 0
        }

        // Proof score calculation
        const proofDifference = Math.abs(sample.proof - (sample.userProof || 0));
        if (proofDifference === 0) {
            proofScore = 35; // Perfect match
        } else if (proofDifference === 1) {
            proofScore = 30; // 1 proof point off
        } else if (proofDifference < 11) {
            // For differences 2-10 proof points, subtract 3 points per proof point from 30
            proofScore = Math.max(0, 30 - (proofDifference - 1) * 3);
        } else {
            proofScore = 0; // 11+ proof points off gets 0
        }

        // Calculate total for this sample
        const sampleTotal = ageScore + proofScore + mashbillScore;

        return {
            id: sample.id,
            ageScore,
            proofScore,
            mashbillScore,
            total: sampleTotal,
            // Include differences for display
            ageDifference,
            proofDifference,
        };
        });

        // Calculate overall total
        const totalScore = sampleScores.reduce(
        (sum, sample) => sum + sample.total,
        0
        );

        // Calculate percentage score (maximum possible is 100 points per sample)
        const maxPossible = samples.length * 100;
        const percentScore = Math.round((totalScore / maxPossible) * 100);

        return {
        totalScore,
        sampleScores,
        percentScore,
        };
    };

    const handleSubmit = () => {
        const calculatedScores = calculateScores();
        setScores(calculatedScores);
        setSubmittedAnswers(true);

        // Log scores for debugging
        console.log("Final scores:", calculatedScores);
    };

    // Render logic
    if (error) return <div>{error}</div>;
    if (!sampleData) return <div>Loading sample data...</div>;

    const currentQuarter = sampleData.currentQuarter;
    const samples = sampleData?.quarters[currentQuarter]?.samples || [];
    const currentSample = samples[currentSampleIndex];

    // If answers are submitted, show results
    if (submittedAnswers) {
        return (
        <ResultsPage
            scores={scores}
            samples={samples}
            onPlayAgain={() => {
            setSubmittedAnswers(false);
            setCurrentSampleIndex(0);
            }}
        />
        );
    }

    return (
        <div className="game-interface">
        {/* Sample navigation tabs */}
        <div className="sample-tabs">
            {samples.map((sample, index) => (
            <button
                key={index}
                className={`sample-tab ${
                currentSampleIndex === index ? "active" : ""
                }`}
                onClick={() => goToSample(index)}
            >
                Sample {sample.id}
            </button>
            ))}
        </div>

        {/* Current sample form */}
        <div className="sample-form">
            <h2>Sample {currentSample.id}</h2>
            <p>
            Take your first sip of Sample {currentSample.id} and see how good your
            whiskey taste buds are...
            </p>

            <div className="form-group">
            <h3>What do you think the age statement is?</h3>
            <SliderInput
                min={1}
                max={10}
                step={1}
                value={currentSample.userAge || 1}
                onChange={(e) =>
                handleInputChange(
                    currentSampleIndex,
                    "age",
                    parseInt(e.target.value)
                )
                }
                label="Age Statement"
                formatLabel={(value) => (value === 10 ? "10+" : value)}
            />
            </div>

            <div className="form-group">
            <h3>What do you think the proof is?</h3>
            <SliderInput
                min={80}
                max={120}
                step={1}
                value={currentSample.userProof || 80}
                onChange={(e) =>
                handleInputChange(
                    currentSampleIndex,
                    "proof",
                    parseInt(e.target.value)
                )
                }
                label="Proof"
                formatLabel={(value) => (value === 120 ? "120+" : value)}
            />
            </div>

            <div className="form-group">
            <h3>What do you think the mashbill is?</h3>
            <div className="radio-group">
                {["Bourbon", "Rye", "Single Malt", "Wheat", "Other"].map((type) => (
                <label key={type} className="radio-label">
                    <input
                    type="radio"
                    name={`mashbill-${currentSampleIndex}`}
                    value={type}
                    checked={currentSample.userMashbill === type}
                    onChange={(e) =>
                        handleInputChange(
                        currentSampleIndex,
                        "mashbill",
                        e.target.value
                        )
                    }
                    />
                    {type}
                </label>
                ))}
            </div>
            </div>

            <div className="form-group">
            <h3>How do you rate this whiskey?</h3>
            <div className="flame-rating">
                {[...Array(10)].map((_, i) => (
                <span
                    key={i}
                    onClick={() =>
                    handleInputChange(currentSampleIndex, "rating", i + 1)
                    }
                >
                    <FlameIcon active={(currentSample.userRating || 0) > i} />
                </span>
                ))}
            </div>
            </div>
        </div>

        {/* Navigation buttons */}
        <div className="sample-navigation">
            <button
            className="prev-button"
            onClick={goToPreviousSample}
            disabled={currentSampleIndex === 0}
            >
            Previous Sample
            </button>

            {currentSampleIndex === samples.length - 1 ? (
            <button className="submit-button" onClick={handleSubmit}>
                Submit All Guesses
            </button>
            ) : (
            <button className="next-button" onClick={goToNextSample}>
                Next Sample
            </button>
            )}
        </div>
        </div>
    );
};

export default GameInterface;
