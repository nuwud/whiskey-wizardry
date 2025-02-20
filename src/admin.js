// filepath: /src/admin.js
import React from 'react';
import ReactDOM from 'react-dom';
import AdminPanel from './components/AdminPanel';
import './styles/AdminPanel.css';

const root = ReactDOM.createRoot(document.getElementById('admin-root'));
root.render(
    <React.StrictMode>
        <AdminPanel />
    </React.StrictMode>
);