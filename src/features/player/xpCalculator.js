import { calculateXPForLevel } from '../../utils/xpUtils';

export const calculateLevelFromXP = (xp) => {
    let requiredXP = 0;
    let previousXP = 0;

    for (let level = 1; level <= 100; level++) {
        previousXP = requiredXP;
        requiredXP = calculateXPForLevel(level);

        if (xp >= previousXP && xp < requiredXP) {
            return level;
        }
    }

    return 100; // Max level
};

export const getRequiredXPForLevel = (level) => {
    return calculateXPForLevel(level);
};
