import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/ResultsPage.css';

const ResultsPage = ({ scores, samples, onPlayAgain }) => {
  const { totalScore, sampleScores } = scores;
  const maxPossibleScore = samples.length * 60; // 60 points possible per sample
  const [expandedSample, setExpandedSample] = useState(null);
  
  // Calculate percentage score
  const percentageScore = (totalScore / maxPossibleScore) * 100;
  
  // Determine performance level
  let performanceMessage = "";
  if (percentageScore >= 80) {
    performanceMessage = "Congratulations on your whiskey tasting skills!";
  } else if (percentageScore >= 60) {
    performanceMessage = "You are on your way to becoming a whiskey connoisseur.";
  } else if (percentageScore >= 40) {
    performanceMessage = "Not bad! Your whiskey knowledge is developing.";
  } else {
    performanceMessage = "Your whiskey tasting skills need some work. Consider taking the masterclass again!";
  }
  
  const toggleSample = (index) => {
    if (expandedSample === index) {
      setExpandedSample(null);
    } else {
      setExpandedSample(index);
    }
  };
  
  return (
    <div className="results-page">
      <h1>Game Completed</h1>
      
      <div className="score-summary">
        <h2>{performanceMessage}</h2>
        <div className="total-score">
          <span className="score-label">Your Total Score:</span>
          <span className="score-value">{totalScore} points</span>
          <span className="score-percentage">({percentageScore.toFixed(1)}%)</span>
        </div>
      </div>
      
      <h3 className="sample-scores-heading">How You Did With Each Sample:</h3>
      
      <div className="sample-scores-accordion">
        {sampleScores.map((sampleScore, index) => {
          const sample = samples[index];
          const isExpanded = expandedSample === index;
          
          return (
            <div key={index} className="accordion-item">
              <div 
                className={`accordion-header ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleSample(index)}
              >
                <h4>Sample {sample.id}</h4>
                <div className="sample-summary">
                  <span className="sample-total-brief">
                    {sampleScore.total}/60 points
                  </span>
                  <span className="accordion-icon">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>
              </div>
              
              {isExpanded && (
                <div className="accordion-content">
                  <div className="sample-details">
                    <div className="actual-values">
                      <h5>Actual Values:</h5>
                      <p>Age: {sample.age} years</p>
                      <p>Proof: {sample.proof}</p>
                      <p>Mashbill: {sample.mashbill}</p>
                    </div>
                    <div className="score-breakdown">
                      <h5>Your Score:</h5>
                      <p>Age Score: {sampleScore.ageScore}/20</p>
                      <p>Proof Score: {sampleScore.proofScore}/20</p>
                      <p>Mashbill Score: {sampleScore.mashbillScore}/20</p>
                      <p className="sample-total">Sample Total: {sampleScore.total}/60</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="actions">
        <button className="play-again-button" onClick={onPlayAgain}>
          Play Again
        </button>
        <button className="share-button">
          Share Your Score!
        </button>
      </div>
    </div>
  );
};

ResultsPage.propTypes = {
  scores: PropTypes.shape({
    totalScore: PropTypes.number.isRequired,
    sampleScores: PropTypes.arrayOf(
      PropTypes.shape({
        ageScore: PropTypes.number.isRequired,
        proofScore: PropTypes.number.isRequired,
        mashbillScore: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  samples: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
      proof: PropTypes.number.isRequired,
      mashbill: PropTypes.string.isRequired,
    })
  ).isRequired,
  onPlayAgain: PropTypes.func.isRequired,
};

export default ResultsPage;
