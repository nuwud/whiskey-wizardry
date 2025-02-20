// filepath: /src/components/SliderInput.jsx
import React from "react";
import PropTypes from "prop-types";
import '../styles/SliderInput.css';

const SliderInput = ({ min, max, step, value, onChange, label }) => {
    return (
        <div className="slider-input">
        <label>
            {label}:
            <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            />
            {value}
        </label>
        </div>
    );
    };

    SliderInput.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
};

export default SliderInput;