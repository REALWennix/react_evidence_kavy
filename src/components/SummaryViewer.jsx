import React, { useState } from 'react';
import SummaryForm from './SummaryForm.jsx';
import SummaryResults from './SummaryResults.jsx';
import { useSummaryData } from '../hooks/useSummaryData.js'; 

function SummaryViewer({ apiUrl, authHeader }) {
    const { summaryData, isLoading, error, loadSummary, setError } = useSummaryData(apiUrl, authHeader);

    const [lastSearchedRange, setLastSearchedRange] = useState({ start: '', end: '' });

    const handleFormSubmit = (start, end) => {
        setError(''); 
        setLastSearchedRange({ start: start, end: end }); 
        loadSummary(start, end);
    };

    return (
        <div>
            <SummaryForm
                isLoading={isLoading}
                onSubmit={handleFormSubmit}
            />

            <div className='summary-results-container mt-4'>
                <SummaryResults
                    isLoading={isLoading}
                    error={error}
                    summaryData={summaryData}
                    startMonth={lastSearchedRange.start} 
                    endMonth={lastSearchedRange.end}
                />
            </div>
        </div>
    );
}

export default SummaryViewer;