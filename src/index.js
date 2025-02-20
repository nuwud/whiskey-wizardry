import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AdminPanel from './components/AdminPanel.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Check if we're on the admin page
if (window.location.pathname.includes('/admin')) {
    root.render(
        <React.StrictMode>
        <AdminPanel />
        </React.StrictMode>
    );
    } else {
    root.render(
        <React.StrictMode>
        <App />
        </React.StrictMode>
    );
}