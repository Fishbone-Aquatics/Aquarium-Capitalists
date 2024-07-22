export const calculateXPForLevel = (level) => {
    if (level <= 30) {
        // Polynomial function for levels 1-30
        const a = 3e6 / Math.pow(30, 2); // a = 3,000,000 / 900
        return Math.round(a * Math.pow(level, 2));
    } else {
        // Exponential function for levels 31-100
        const C = 3e6; // XP at level 30
        const D = (200e6 - C) / Math.pow(70, 2); // Growth rate for levels 31-100
        return Math.round(C + D * Math.pow(level - 30, 2));
    }
};
