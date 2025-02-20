import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
    const [quarter, setQuarter] = useState(process.env.CURRENT_QUARTER);
    const [samples, setSamples] = useState([]);

    useEffect(() => {
        const fetchSamples = async () => {
        const querySnapshot = await getDocs(collection(db, `quarters/${quarter}/samples`));
        const samplesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSamples(samplesData);
        };

        fetchSamples();
    }, [quarter]);

    const handleQuarterChange = (e) => {
        setQuarter(e.target.value);
    };

    const handleSampleChange = (index, field, value) => {
        const updatedSamples = [...samples];
        updatedSamples[index][field] = value;
        setSamples(updatedSamples);
    };

    const handleSave = async () => {
        for (const sample of samples) {
        if (sample.id) {
            const sampleRef = doc(db, `quarters/${quarter}/samples`, sample.id);
            await updateDoc(sampleRef, sample);
        } else {
            await addDoc(collection(db, `quarters/${quarter}/samples`), sample);
        }
        }
        console.log("Samples saved successfully");
    };

    return (
        <div className="admin-panel">
        <h2>Admin Panel</h2>
        <label>
            Choose Quarter:
            <select value={quarter} onChange={handleQuarterChange}>
            {/* Add options for quarters */}
            </select>
        </label>
        {samples.map((sample, index) => (
            <div key={sample.id} className="sample">
            <h3>Sample {sample.id}</h3>
            <label>
                Sample Name:
                <input
                type="text"
                value={sample.name}
                onChange={(e) => handleSampleChange(index, "name", e.target.value)}
                />
            </label>
            {/* Add other fields */}
            </div>
        ))}
        <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default AdminPanel;