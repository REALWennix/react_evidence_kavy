import React from 'react';
import SummaryTable from './SummaryTable.jsx';
import { getMonthName } from '../utils/months';

function SummaryResults({
    isLoading,
    error,
    summaryData,
    startMonth, 
    endMonth    
}) {

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                    <span className="visually-hidden">Načítám data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger" role="alert">{error}</div>;
    }

    if (summaryData === null) {
        return null;
    }

    return (
        <>
            {summaryData.length > 0 && startMonth && endMonth && (
                <h3 className="text-center mb-4 h4">
                    Souhrn za období {getMonthName(startMonth)} - {getMonthName(endMonth)}
                </h3>
            )}

            <SummaryTable data={summaryData} tableStyle="light" />

            {summaryData.length === 0 && startMonth && endMonth && (
                <div className="alert alert-light text-center border mt-4">
                    Pro vybrané období nejsou k dispozici žádná data.
                </div>
            )}
        </>
    );
}

export default SummaryResults;