import React, { useState, useEffect } from "react";
import SliderInput from "./SliderInput.jsx";
import "../styles/GameInterface.css";
import ResultsPage from "./ResultsPage.jsx"; // You'll need to create this component
import FlameIcon from "./FlameIcon.jsx"; // Import the FlameIcon component

const GameInterface = () => {
    const [sampleData, setSampleData] = useState(null);
    const [error, setError] = useState(null);
    const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
    const [submittedAnswers, setSubmittedAnswers] = useState(false);
    const [scores, setScores] = useState({
        totalScore: 0,
        sampleScores: []
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
            const initializedSamples = data.quarters[data.currentQuarter].samples.map(sample => ({
            ...sample,
            userAge: 0,
            userProof: 80,
            userMashbill: "",
            userRating: 0,
            score: 0
            }));
            
            setSampleData({
            ...data,
            quarters: {
                ...data.quarters,
                [data.currentQuarter]: {
                ...data.quarters[data.currentQuarter],
                samples: initializedSamples
                }
            }
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
        updatedSamples[index][`user${field.charAt(0).toUpperCase() + field.slice(1)}`] = value;
        
        setSampleData({
        ...sampleData,
        quarters: {
            ...sampleData.quarters,
            [currentQuarter]: {
            ...sampleData.quarters[currentQuarter],
            samples: updatedSamples
            }
        }
        });
    };
    
    // Calculate scores based on user answers
    const calculateScores = () => {
        const sampleScores = samples.map(sample => {
        // Initialize score components
        let ageScore = 0;
        let proofScore = 0;
        let mashbillScore = 0;
        
        // Age score - full points if exact, partial points based on closeness
        const ageDifference = Math.abs(sample.age - (sample.userAge || 0));
        if (ageDifference === 0) {
            ageScore = 20; // Perfect match
        } else if (ageDifference <= 2) {
            ageScore = 15; // Close
        } else if (ageDifference <= 4) {
            ageScore = 10; // Somewhat close
        } else if (ageDifference <= 6) {
            ageScore = 5; // Not very close
        }
        
        // Proof score - similar scale
        const proofDifference = Math.abs(sample.proof - (sample.userProof || 0));
        if (proofDifference === 0) {
            proofScore = 20; // Perfect match
        } else if (proofDifference <= 5) {
            proofScore = 15; // Close
        } else if (proofDifference <= 10) {
            proofScore = 10; // Somewhat close
        } else if (proofDifference <= 15) {
            proofScore = 5; // Not very close
        }
        
        // Mashbill score - all or nothing
        if (sample.userMashbill === sample.mashbill) {
            mashbillScore = 20;
        }
        
        // Calculate total for this sample
        const sampleTotal = ageScore + proofScore + mashbillScore;
        
        return {
            id: sample.id,
            ageScore,
            proofScore,
            mashbillScore,
            total: sampleTotal
        };
        });
        
        // Calculate overall total
        const totalScore = sampleScores.reduce((sum, sample) => sum + sample.total, 0);
        
        return {
        totalScore,
        sampleScores
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
        return <ResultsPage 
        scores={scores}
        samples={samples}
        onPlayAgain={() => {
            setSubmittedAnswers(false);
            setCurrentSampleIndex(0);
        }}
        />;
    }
    
    return (
        <div className="game-interface">
        {/* Sample navigation tabs */}
        <div className="sample-tabs">
            {samples.map((sample, index) => (
            <button 
                key={index}
                className={`sample-tab ${currentSampleIndex === index ? 'active' : ''}`}
                onClick={() => goToSample(index)}
            >
                Sample {sample.id}
            </button>
            ))}
        </div>
        
        {/* Current sample form */}
        <div className="sample-form">
            <h2>Sample {currentSample.id}</h2>
            <p>Take your first sip of Sample {currentSample.id} and see how good your whiskey taste buds are...</p>
            
            <div className="form-group">
            <h3>What do you think the age statement is?</h3>
            <SliderInput
                min={0}
                max={25}
                step={1}
                value={currentSample.userAge || 0}
                onChange={(e) => handleInputChange(currentSampleIndex, "age", parseInt(e.target.value))}
                label="Age Statement"
            />
            </div>
            
            <div className="form-group">
            <h3>What do you think the proof is?</h3>
            <SliderInput
                min={80}
                max={120}
                step={1}
                value={currentSample.userProof || 80}
                onChange={(e) => handleInputChange(currentSampleIndex, "proof", parseInt(e.target.value))}
                label="Proof"
            />
            </div>
            
            <div className="form-group">
            <h3>What do you think the mashbill is?</h3>
            <div className="radio-group">
                {['Bourbon', 'Rye', 'Wheat', 'Single Malt', 'Specialty'].map(type => (
                <label key={type} className="radio-label">
                    <input
                    type="radio"
                    name={`mashbill-${currentSampleIndex}`}
                    value={type}
                    checked={currentSample.userMashbill === type}
                    onChange={(e) => handleInputChange(currentSampleIndex, "mashbill", e.target.value)}
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
                    onClick={() => handleInputChange(currentSampleIndex, "rating", i + 1)}
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
            <button 
                className="submit-button"
                onClick={handleSubmit}
            >
                Submit All Guesses
            </button>
            ) : (
            <button 
                className="next-button" 
                onClick={goToNextSample}
            >
                Next Sample
            </button>
            )}
        </div>
        </div>
    );
};

export default GameInterface;