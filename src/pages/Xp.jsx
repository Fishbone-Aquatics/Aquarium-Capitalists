//src/pages/Xp.jsx
import React from 'react';
import XPCurve from '../components/XPCurve';

function XP() {
    return (
        <div className="xp-container">
            <header className="xp-header">
                <h1>Leveling System XP Curve</h1>
            </header>
            <main>
                <XPCurve />
            </main>
        </div>
    );
}

export default XP;
