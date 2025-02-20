import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/ResultsPage.css';

const ResultsPage = ({ scores, samples, onPlayAgain }) => {
  const { totalScore, sampleScores } = scores;
  const maxPossibleScore = samples.length * 100; // 100 points possible per sample
  const [expandedSample, setExpandedSample] = useState(null);
  const [shareTooltip, setShareTooltip] = useState('');
  
  // Calculate percentage score
  const percentageScore = (totalScore / maxPossibleScore) * 100;
  
  // Determine whiskey title based on percentage score
  const getWhiskeyTitle = (percentScore) => {
    if (percentScore >= 90) return "Whiskey Wizard";
    if (percentScore >= 80) return "Oak Overlord";
    if (percentScore >= 60) return "Cask Commander";
    if (percentScore >= 40) return "Whiskey Explorer";
    if (percentScore >= 20) return "Whiskey Rookie";
    return "Barrel Beginner";
  };

  const getWhiskeyTitleDescription = (title) => {
    switch(title) {
      case "Whiskey Wizard":
        return "Master level (90-100)! Your whiskey knowledge and palate are truly exceptional!";
      case "Oak Overlord":
        return "Expert level (80-89)! You have a remarkably refined sense of taste.";
      case "Cask Commander": 
        return "Advanced level (60-79)! Your whiskey expertise is impressive.";
      case "Whiskey Explorer":
        return "Intermediate level (40-59)! You're developing a good understanding of whiskey.";
      case "Whiskey Rookie":
        return "Novice level (20-39)! Your whiskey journey is well underway.";
      case "Barrel Beginner":
        return "Beginner level (0-19)! Everyone starts somewhere - keep practicing!";
      default:
        return "";
    }
  };

  const whiskeyTitle = getWhiskeyTitle(scores.percentScore || percentageScore);
  
  const toggleSample = (index) => {
    if (expandedSample === index) {
      setExpandedSample(null);
    } else {
      setExpandedSample(index);
    }
  };
  
  // Generate shareable text in Wordle-style
  const generateShareText = () => {
    const shareLines = [
      `🥃 Whiskey Wizardry 🥃`,
      `Rank: ${whiskeyTitle}`,
      `Score: ${totalScore}/${maxPossibleScore} (${scores.percentScore || percentageScore.toFixed(0)}%)`,
      ``,
    ];
    
    // Add sample results using emojis
    samples.forEach((_, index) => {
      const score = sampleScores[index];
      const samplePercent = (score.total / 100) * 100;
      
      // Create emoji representation
      let emoji;
      if (samplePercent >= 90) emoji = '🟩'; // Excellent
      else if (samplePercent >= 70) emoji = '🟨'; // Good
      else if (samplePercent >= 40) emoji = '🟧'; // Fair
      else emoji = '🟥'; // Needs improvement
      
      shareLines.push(`Sample ${samples[index].id}: ${emoji} ${score.total}/100`);
    });
    
    // Add call to action
    shareLines.push(``);
    shareLines.push(`Think you can beat my score? Try Whiskey Wizardry at whiskey-wizardry.web.app!`);
    
    return shareLines.join('\n');
  };
  
  const handleShare = () => {
    const shareText = generateShareText();
    
    if (navigator.share) {
      navigator.share({
        title: 'My Whiskey Wizardry Score',
        text: shareText
      }).catch(() => {
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setShareTooltip('Copied to clipboard!');
      setTimeout(() => setShareTooltip(''), 3000);
    }).catch(() => {
      setShareTooltip('Failed to copy');
      setTimeout(() => setShareTooltip(''), 3000);
    });
  };
  
  return (
    <div className="results-page">
      <h1>Game Completed</h1>
      
      <div className="score-summary">
        <h2 className="whiskey-title">{whiskeyTitle}</h2>
        <p className="title-description">{getWhiskeyTitleDescription(whiskeyTitle)}</p>
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
                    {sampleScore.total}/100 points
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
                      <p>Age: {sampleScore.ageScore}/35 
                        {sampleScore.ageDifference === 0 ? 
                          <span className="perfect-match">(Perfect match!)</span> : 
                          sampleScore.ageDifference === 1 ?
                          <span className="close-match">(Just 1 year off)</span> :
                          <span className="score-difference">({sampleScore.ageDifference} years off)</span>
                        }
                      </p>
                      <p>Proof: {sampleScore.proofScore}/35
                        {sampleScore.proofDifference === 0 ? 
                          <span className="perfect-match">(Perfect match!)</span> : 
                          sampleScore.proofDifference === 1 ?
                          <span className="close-match">(Just 1 point off)</span> :
                          <span className="score-difference">({sampleScore.proofDifference} points off)</span>
                        }
                      </p>
                      <p>Mashbill: {sampleScore.mashbillScore}/30
                        {sampleScore.mashbillScore === 30 ? 
                          <span className="perfect-match">(Correct!)</span> : 
                          <span className="incorrect-match">(Incorrect)</span>
                        }
                      </p>
                      <p className="sample-total">Sample Total: {sampleScore.total}/100</p>
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
        <div className="share-container">
          <button className="share-button" onClick={handleShare}>
            Share Your Score!
          </button>
          {shareTooltip && <div className="share-tooltip">{shareTooltip}</div>}
        </div>
      </div>
    </div>
  );
};

ResultsPage.propTypes = {
  scores: PropTypes.shape({
    totalScore: PropTypes.number.isRequired,
    percentScore: PropTypes.number,
    sampleScores: PropTypes.arrayOf(
      PropTypes.shape({
        ageScore: PropTypes.number.isRequired,
        proofScore: PropTypes.number.isRequired,
        mashbillScore: PropTypes.number.isRequired,
        ageDifference: PropTypes.number.isRequired,
        proofDifference: PropTypes.number.isRequired,
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