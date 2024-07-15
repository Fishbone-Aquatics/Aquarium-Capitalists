// src/features/player/xpCalculator.js
export const calculateLevelFromXP = (xp) => {
    const polynomialXP = (n) => 3e6 / Math.pow(30, 2) * Math.pow(n, 2);
    const exponentialXP = (n) => 3e6 + (200e6 - 3e6) / Math.pow(70, 2) * Math.pow(n - 30, 2);

    for (let level = 1; level <= 100; level++) {
        let requiredXP;
        if (level <= 30) {
            requiredXP = polynomialXP(level);
        } else {
            requiredXP = exponentialXP(level);
        }

        if (xp < requiredXP) {
            return level - 1;
        }
    }

    return 100; // Max level
};