export const calculateLevelFromXP = (xp) => {
    const polynomialXP = (n) => Math.round(3e6 / Math.pow(30, 2) * Math.pow(n, 2));
    const exponentialXP = (n) => Math.round(3e6 + (200e6 - 3e6) / Math.pow(70, 2) * Math.pow(n - 30, 2));

    let requiredXP = 0;

    for (let level = 1; level <= 100; level++) {
        if (level <= 30) {
            requiredXP = polynomialXP(level);
        } else {
            requiredXP = exponentialXP(level);
        }
        if (xp < requiredXP) {
            return level;
        }
    }

    return 100; // Max level
};

export const getRequiredXPForLevel = (level) => {
    const polynomialXP = (n) => Math.round(3e6 / Math.pow(30, 2) * Math.pow(n, 2));
    const exponentialXP = (n) => Math.round(3e6 + (200e6 - 3e6) / Math.pow(70, 2) * Math.pow(n - 30, 2));

    if (level <= 30) {
        return polynomialXP(level);
    } else {
        return exponentialXP(level);
    }
};
