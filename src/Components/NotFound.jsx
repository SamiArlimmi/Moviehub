import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ fontSize: '72px', margin: '0', color: '#333' }}>404</h1>
            <h2 style={{ fontSize: '24px', margin: '20px 0', color: '#666' }}>
                Page notfound
            </h2>
            <p style={{ fontSize: '16px', margin: '20px 0', color: '#888' }}>
                Sorry, the page you are looking for does not exits.
            </p>
            <Link
                to="/"
                style={{
                    padding: '12px 24px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    marginTop: '20px'
                }}
            >
                Go back to Home
            </Link>
        </div>
    );
};

export default NotFound;