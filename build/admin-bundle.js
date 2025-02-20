
// Admin credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "supersecurepassword";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB-gJVtiohfMie9fr9NrXoGGSmEfS9sS8s",
    authDomain: "whiskey-wizardry.firebaseapp.com",
    projectId: "whiskey-wizardry",
    storageBucket: "whiskey-wizardry.firebasestorage.app",
    messagingSenderId: "562241928558",
    appId: "1:562241928558:web:86c3d967e83e0b01b6d57f",
    measurementId: "G-0EVD5MWHCG"
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
        // Simulate authentication with environment variables instead of Firebase Auth
        const checkAdminAuth = () => {
            const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
            setUser(isAuthenticated ? { username: 'Admin' } : null);
            setLoading(false);
        };
        
        checkAdminAuth();
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
            db.collection('quarters/' + currentQuarter + '/samples').get()
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
            return db.collection('quarters/' + currentQuarter + '/samples').doc(sample.id).set({
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
        const username = prompt("Enter username:");
        const password = prompt("Enter password:");
        
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            sessionStorage.setItem('adminAuthenticated', 'true');
            setUser({ username: 'Admin' });
        } else {
            setMessage("Invalid username or password");
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuthenticated');
        setUser(null);
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
            React.createElement('span', null, 'Logged in as Admin '),
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
                    React.createElement('h3', null, 'Sample ' + sample.id),
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
