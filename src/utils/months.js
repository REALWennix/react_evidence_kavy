// src/utils/months.js

export const monthNames = [
    "Leden", "Únor", "Březen", "Duben", "Květen", "Červen",
    "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"
];

export const getMonthName = (monthNumber) => {
    const num = parseInt(monthNumber, 10);
    return (num >= 1 && num <= 12) ? monthNames[num - 1] : '';
};

export const generateMonthsOptions = () => {
    return monthNames.map((name, index) => ({ value: index + 1, name: name }));
};