import React from "react";
import PropTypes from "prop-types";
import '../styles/SliderInput.css';

const SliderInput = ({ min, max, step, value, onChange, label, formatLabel }) => {
    const displayValue = formatLabel ? formatLabel(value) : value;
    
    return (
        <div className="slider-input">
            <div className="slider-container">
                <div className="slider-value">{displayValue}</div>
                <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={onChange}
                className="slider"
                />
            </div>
            <div className="slider-range-labels">
                <span className="min-label">{min}</span>
                <span className="max-label">{max === 10 ? "10+" : max === 120 ? "120+" : max}</span>
            </div>
            </div>
        );
};

SliderInput.defaultProps = {
    formatLabel: null
};

SliderInput.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    formatLabel: PropTypes.func
};

export default SliderInput;