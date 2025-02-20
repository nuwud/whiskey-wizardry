import React from "react";
import PropTypes from "prop-types";
import "../styles/SampleForm.css";

/* 
Design Overview:
- Color Scheme: Deep amber and rich brown tones reminiscent of whiskey.
- Typography: Elegant serif fonts for headings; clean sans-serif for body text.
- Layout: Form-based design with subtle shadows; ample whitespace for a refined look.
*/

const SampleForm = ({ onSubmit, sampleData }) => {
    const handleChange = (field, value) => {
        onSubmit({ ...sampleData, [field]: value });
    };

    return (
        <div className="sample-form">
        <h3>Sample Form</h3>
        <label>
            Sample Name:
            <input
            type="text"
            value={sampleData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            />
        </label>
        <label>
            Distillery:
            <input
            type="text"
            value={sampleData.distillery}
            onChange={(e) => handleChange("distillery", e.target.value)}
            />
        </label>
        <label>
            Region:
            <input
            type="text"
            value={sampleData.region}
            onChange={(e) => handleChange("region", e.target.value)}
            />
        </label>
        <label>
            Type:
            <input
            type="text"
            value={sampleData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            />
        </label>
        <label>
            Age:
            <input
            type="number"
            value={sampleData.age}
            onChange={(e) => handleChange("age", e.target.value)}
            />
        </label>
        <label>
            Proof:
            <input
            type="number"
            value={sampleData.proof}
            onChange={(e) => handleChange("proof", e.target.value)}
            />
        </label>
        <label>
            Mashbill:
            <input
            type="text"
            value={sampleData.mashbill}
            onChange={(e) => handleChange("mashbill", e.target.value)}
            />
        </label>
        <label>
            Description:
            <textarea
            value={sampleData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            />
        </label>
        <label>
            Price:
            <input
            type="number"
            value={sampleData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            />
        </label>
        <button onClick={() => onSubmit(sampleData)}>Submit</button>
        </div>
    );
};

SampleForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    sampleData: PropTypes.shape({
        name: PropTypes.string,
        distillery: PropTypes.string,
        region: PropTypes.string,
        type: PropTypes.string,
        age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        proof: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        mashbill: PropTypes.string,
        description: PropTypes.string,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
};

export default SampleForm;