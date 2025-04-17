// src/utils/drinkStyles.js

export const getDrinkButtonClass = (drinkName = '') => {
    const nameLower = drinkName.toLowerCase().replace('+', '');
    if (nameLower.includes('mléko') || nameLower.includes('milk')) return 'btn-milk';
    if (nameLower.includes('espresso')) return 'btn-espresso';
    if (nameLower.includes('coffe') || nameLower.includes('káva')) return 'btn-coffe';
    if (nameLower.includes('long')) return 'btn-long';
    if (nameLower.includes('doppio')) return 'btn-doppio';
    return 'btn-other';
};

export const getDrinkBadgeClass = (drinkName = '') => {
    const nameLower = drinkName.toLowerCase().replace('+', '');
    if (nameLower.includes('mléko') || nameLower.includes('milk')) return 'badge-milk';
    if (nameLower.includes('espresso')) return 'badge-espresso';
    if (nameLower.includes('coffe') || nameLower.includes('káva')) return 'badge-coffe';
    if (nameLower.includes('long')) return 'badge-long';
    if (nameLower.includes('doppio')) return 'badge-doppio';
    return 'badge-other';
};
