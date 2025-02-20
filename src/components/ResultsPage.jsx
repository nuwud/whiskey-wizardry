import React from "react";
import { useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
} from "reactstrap"; // Assuming you're using reactstrap for accordion
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from "react-share"; // Assuming you're using react-share for social media sharing
import {
  calculateTotalScore,
  determineRank,
  calculateScore,
} from "../utils/scoring";

const ResultsPage = () => {
  const location = useLocation();
  const { playerGuesses, correctAnswers } = location.state || {
    playerGuesses: [],
    correctAnswers: [],
  };

  const totalScore = calculateTotalScore(playerGuesses, correctAnswers);
  const rank = determineRank(totalScore);  

  return (
    <div>
      <h1>Results Page</h1>
      <h2>Total Score: {totalScore}</h2>
      <h3>Rank: {rank}</h3>
      <div>
        <h4>Share Your Score:</h4>
        <FacebookShareButton
          url={window.location.href}
          quote={`I scored ${totalScore} in Whiskey Wizardry!`}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton
          url={window.location.href}
          title={`I scored ${totalScore} in Whiskey Wizardry!`}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </div>
      <h2>Score Breakdown</h2>
      {playerGuesses.map((guess, index) => (
        <Accordion key={index}>
          <AccordionItem>
            <AccordionHeader>Sample {guess.label}</AccordionHeader>
            <AccordionBody>
              <p>Your Guess: {JSON.stringify(guess)}</p>
              <p>Correct Answer: {JSON.stringify(correctAnswers[index])}</p>
              <p>Score: {calculateScore(guess, correctAnswers[index])}</p>
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default ResultsPage;
