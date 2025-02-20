// src/components/AdminAuthWrapper.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { auth } from '../firebase';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';

const AdminAuthWrapper = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const tokenResult = await getIdTokenResult(user);
                const admin = tokenResult.claims.admin || false;
                setUser(user);
                setIsAdmin(admin);
            } else {
                setUser(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>You must be logged in to access the admin panel.</div>;
    }

    if (!isAdmin) {
        return <div>You do not have the necessary permissions to access this page.</div>;
    }

    return children;
};

AdminAuthWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AdminAuthWrapper;