import React from "react";
import PropTypes from "prop-types";
import '../styles/SliderInput.css';

const SliderInput = ({ min, max, step, value, onChange, label }) => {
  // Ensure value is never undefined
    const safeValue = value !== undefined ? value : min;
    
    return (
        <div className="slider-input">
        <div className="slider-container">
            <div className="slider-value">{safeValue}</div>
            <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={safeValue}
            onChange={onChange}
            className="slider"
            />
        </div>
        </div>
    );
    };

    SliderInput.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
};

export default SliderInput;