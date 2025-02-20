require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Verify environment variables
const requiredEnvVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID',
    'REACT_APP_FIREBASE_MEASUREMENT_ID'
];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.warn(`Warning: ${varName} not found in environment variables`);
    }
});

// Create a simple standalone JS file for the admin page
const adminBundle = `
// Initialize Firebase
const firebaseConfig = {
    apiKey: "${process.env.REACT_APP_FIREBASE_API_KEY}",
    authDomain: "${process.env.REACT_APP_FIREBASE_AUTH_DOMAIN}",
    projectId: "${process.env.REACT_APP_FIREBASE_PROJECT_ID}",
    storageBucket: "${process.env.REACT_APP_FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${process.env.REACT_APP_FIREBASE_APP_ID}",
    measurementId:"${process.env.REACT_APP_FIREBASE_MEASUREMENT_ID}"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Admin Panel Component
function AdminPanel() {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [quarters, setQuarters] = React.useState([]);
    const [currentQuarter, setCurrentQuarter] = React.useState('');
    const [samples, setSamples] = React.useState([]);
    const [message, setMessage] = React.useState('');

    // Check authentication
    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Fetch quarters
    React.useEffect(() => {
        if (user) {
            db.collection('quarters').get()
                .then((snapshot) => {
                    const quartersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setQuarters(quartersData);
                    if (quartersData.length > 0 && !currentQuarter) {
                        setCurrentQuarter(quartersData[0].id);
                    }
                })
                .catch(err => {
                    console.error("Error fetching quarters:", err);
                    setMessage("Error loading quarters");
                });
        }
    }, [user, currentQuarter]);

    // Fetch samples for selected quarter
    React.useEffect(() => {
        if (user && currentQuarter) {
            db.collection(\`quarters/\${currentQuarter}/samples\`).get()
                .then((snapshot) => {
                    const samplesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setSamples(samplesData);
                })
                .catch(err => {
                    console.error("Error fetching samples:", err);
                    setMessage("Error loading samples");
                });
        }
    }, [user, currentQuarter]);

    const handleQuarterChange = (e) => {
        setCurrentQuarter(e.target.value);
    };

    const handleSampleChange = (index, field, value) => {
        const updatedSamples = [...samples];
        updatedSamples[index][field] = value;
        setSamples(updatedSamples);
    };

    const handleSave = () => {
        if (!user) {
            setMessage("You must be logged in to save changes");
            return;
        }

        const promises = samples.map(sample => {
            return db.collection(\`quarters/\${currentQuarter}/samples\`).doc(sample.id).set({
                name: sample.name,
                age: Number(sample.age),
                proof: Number(sample.proof),
                mashbill: sample.mashbill
            }, { merge: true });
        });

        Promise.all(promises)
            .then(() => {
                setMessage("Samples saved successfully!");
                setTimeout(() => setMessage(""), 3000);
            })
            .catch(err => {
                console.error("Error saving samples:", err);
                setMessage("Error saving samples");
            });
    };

    const handleLogin = () => {
        const email = prompt("Enter your email:");
        const password = prompt("Enter your password:");
        if (email && password) {
            auth.signInWithEmailAndPassword(email, password)
                .catch(err => {
                    console.error("Login error:", err);
                    setMessage("Login failed: " + err.message);
                });
        }
    };

    const handleLogout = () => {
        auth.signOut();
    };

    if (loading) {
        return React.createElement('div', null, 'Loading...');
    }

    if (!user) {
        return React.createElement('div', { style: { textAlign: 'center', padding: '20px' } }, [
            React.createElement('h2', null, 'Admin Login Required'),
            React.createElement('button', { onClick: handleLogin, style: { padding: '10px 20px' } }, 'Login'),
            message && React.createElement('div', { style: { color: 'red', marginTop: '10px' } }, message)
        ]);
    }

    return React.createElement('div', { style: { maxWidth: '800px', margin: '0 auto', padding: '20px' } }, [
        React.createElement('h1', null, 'Whiskey Wizardry Admin Panel'),
        React.createElement('div', { style: { marginBottom: '20px' } }, [
            React.createElement('span', null, \`Logged in as \${user.email} \`),
            React.createElement('button', { onClick: handleLogout }, 'Logout')
        ]),
        message && React.createElement('div', { 
            style: { 
                padding: '10px', 
                marginBottom: '20px',
                backgroundColor: message.includes('Error') ? '#ffdddd' : '#ddffdd',
                borderRadius: '5px'
            } 
        }, message),
        React.createElement('div', { style: { marginBottom: '20px' } }, [
            React.createElement('label', null, [
                'Quarter: ',
                React.createElement('select', { value: currentQuarter, onChange: handleQuarterChange }, [
                    React.createElement('option', { value: '' }, 'Select Quarter'),
                    ...quarters.map(q => React.createElement('option', { value: q.id, key: q.id }, q.name || q.id))
                ])
            ])
        ]),
        currentQuarter && React.createElement('div', null, [
            React.createElement('h2', null, 'Samples'),
            samples.map((sample, index) => 
                React.createElement('div', { key: index, style: { border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '5px' } }, [
                    React.createElement('h3', null, \`Sample \${sample.id}\`),
                    React.createElement('div', null, [
                        React.createElement('label', null, [
                            'Name: ',
                            React.createElement('input', {
                                type: 'text',
                                value: sample.name || '',
                                onChange: (e) => handleSampleChange(index, 'name', e.target.value),
                                style: { width: '100%', padding: '5px', marginBottom: '10px' }
                            })
                        ])
                    ]),
                    React.createElement('div', null, [
                        React.createElement('label', null, [
                            'Age: ',
                            React.createElement('input', {
                                type: 'number',
                                min: '1',
                                max: '25',
                                value: sample.age || '',
                                onChange: (e) => handleSampleChange(index, 'age', e.target.value),
                                style: { width: '100%', padding: '5px', marginBottom: '10px' }
                            })
                        ])
                    ]),
                    React.createElement('div', null, [
                        React.createElement('label', null, [
                            'Proof: ',
                            React.createElement('input', {
                                type: 'number',
                                min: '80',
                                max: '140',
                                value: sample.proof || '',
                                onChange: (e) => handleSampleChange(index, 'proof', e.target.value),
                                style: { width: '100%', padding: '5px', marginBottom: '10px' }
                            })
                        ])
                    ]),
                    React.createElement('div', null, [
                        React.createElement('label', null, [
                            'Mashbill: ',
                            React.createElement('select', {
                                value: sample.mashbill || '',
                                onChange: (e) => handleSampleChange(index, 'mashbill', e.target.value),
                                style: { width: '100%', padding: '5px', marginBottom: '10px' }
                            }, [
                                React.createElement('option', { value: 'Bourbon' }, 'Bourbon'),
                                React.createElement('option', { value: 'Rye' }, 'Rye'),
                                React.createElement('option', { value: 'Single Malt' }, 'Single Malt'),
                                React.createElement('option', { value: 'Wheat' }, 'Wheat'),
                                React.createElement('option', { value: 'Other' }, 'Other')
                            ])
                        ])
                    ])
                ])
            ),
            React.createElement('button', { 
                onClick: handleSave,
                style: { padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
            }, 'Save Changes')
        ])
    ]);
}

// Render the admin panel
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(AdminPanel));
} else {
    console.error("Root element not found");
}
`;

// Ensure build directory exists
if (!fs.existsSync('build')) {
    fs.mkdirSync('build');
}

// Save the admin bundle
fs.writeFileSync(path.join('build', 'admin-bundle.js'), adminBundle);

// Copy admin.html to build
fs.copyFileSync(path.join('public', 'admin.html'), path.join('build', 'admin.html'));

console.log('Admin bundle created successfully!');