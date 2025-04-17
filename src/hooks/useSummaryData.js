// src/hooks/useSummaryData.js
import { useState, useCallback } from 'react';

const mergeSummaryData = (allMonthlyData) => {
    const result = {};
    allMonthlyData.forEach(monthlyData => {
        if (Array.isArray(monthlyData)) {
            monthlyData.forEach(entry => {
                if (Array.isArray(entry) && entry.length >= 2) {
                    const drinkName = entry[0];
                    const countStr = entry[1];
                    const count = parseInt(countStr, 10);
                    if (!isNaN(count)) { result[drinkName] = (result[drinkName] || 0) + count; }
                }
            });
        }
    });
    return Object.entries(result);
};

export function useSummaryData(apiUrl, authHeader) {
    const [summaryData, setSummaryData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSummaryForMonth = useCallback(async (monthNumber) => {
        try {
            const url = `${apiUrl}?cmd=getSummaryOfDrinks&month=${monthNumber}&_=${new Date().getTime()}`;
            const response = await fetch(url, { method: 'GET', headers: { "Authorization": authHeader, "Accept": "application/json" } });
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Hook: Fetch Error ${response.status} for month ${monthNumber}: ${errorText}`);
                if (response.status === 401) {
                    throw new Error(`Chyba autentizace (401)`);
                }
                throw new Error(`HTTP chyba ${response.status}: ${errorText || response.statusText}`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) { return []; }
            return data;
        } catch (err) {
            console.error(`Hook: Error fetching summary for month ${monthNumber}:`, err);
            throw err;
        }
    }, [apiUrl, authHeader]);

    const loadSummary = useCallback(async (startMonth, endMonth) => {
        if (!startMonth || !endMonth || startMonth > endMonth) {
            console.warn("loadSummary called with invalid months:", startMonth, endMonth);
            return;
        }

        setIsLoading(true);
        setError('');
        setSummaryData(null);

        const requests = [];
        for (let month = startMonth; month <= endMonth; month++) {
            requests.push(fetchSummaryForMonth(month).catch(err => ({ error: true, month: month, message: err.message })));
        }

        try {
            const results = await Promise.all(requests);
            const successfulResults = results.filter(r => !r?.error);
            const failedRequests = results.filter(r => r?.error);

            if (failedRequests.length > 0) {
                const authFailed = failedRequests.some(f => f.message.includes("401"));
                if (authFailed) { setError("Chyba autentizace při načítání přehledu."); }
                else { const failedMonths = failedRequests.map(f => f.month).join(', '); setError(`Nepodařilo se načíst data pro měsíce: ${failedMonths}.`); }
            }

            const mergedData = mergeSummaryData(successfulResults);
            setSummaryData(mergedData);

        } catch (err) {
            console.error("Hook: Unexpected error during summary processing:", err);
            setError(`Nastala neočekávaná chyba při zpracování souhrnu.`);
            setSummaryData(null);
        }
        finally {
            setIsLoading(false);
        }
    }, [fetchSummaryForMonth]);

    return { summaryData, isLoading, error, loadSummary, setError };
}