import React, { useState, useMemo } from 'react';
import { generateMonthsOptions } from '../utils/months';

function SummaryForm({ isLoading, onSubmit }) {
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [formError, setFormError] = useState(''); 

    const monthsOptions = useMemo(() => generateMonthsOptions(), []);

    const filteredEndMonthOptions = useMemo(() => {
        if (!startMonth) return monthsOptions;
        return monthsOptions.filter(m => m.value >= parseInt(startMonth, 10));
    }, [startMonth, monthsOptions]);

    React.useEffect(() => {
        if (startMonth && endMonth) {
            const startNum = parseInt(startMonth, 10);
            const endNum = parseInt(endMonth, 10);
            if (endNum < startNum) {
                setEndMonth('');
            }
        }
    }, [startMonth, endMonth]);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setFormError(''); 


        if (!startMonth || !endMonth) {
            setFormError("Prosím, vyberte počáteční i koncový měsíc.");
            return;
        }
        if (parseInt(startMonth, 10) > parseInt(endMonth, 10)) {
            setFormError("Počáteční měsíc nemůže být pozdější než koncový měsíc.");
            return;
        }

        onSubmit(parseInt(startMonth, 10), parseInt(endMonth, 10));
    };

    return (
        <form onSubmit={handleFormSubmit} className="mb-4 pb-3 border-bottom">
            <div className="row g-3">
                <div className="col-12 col-md-4">
                    <label htmlFor="startMonthSummary" className="form-label mb-1">Od měsíce:</label>
                    <select
                        id="startMonthSummary" 
                        className="form-select"
                        value={startMonth}
                        onChange={(e) => setStartMonth(e.target.value)}
                        required
                        disabled={isLoading}
                    >
                        <option value="" disabled>Vyberte...</option>
                        {monthsOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="endMonthSummary" className="form-label mb-1">Do měsíce:</label>
                    <select
                        id="endMonthSummary" 
                        className="form-select"
                        value={endMonth}
                        onChange={(e) => setEndMonth(e.target.value)}
                        required
                        disabled={isLoading || !startMonth}
                    >
                        <option value="" disabled>Vyberte...</option>
                        {filteredEndMonthOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 col-md-4 d-flex align-items-end mt-3 mt-md-0">
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isLoading || !startMonth || !endMonth} 
                    >
                        {isLoading ? (
                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Načítám...</>
                        ) : (
                            'Zobrazit přehled'
                        )}
                    </button>
                </div>
            </div>
            {formError && <div className="alert alert-warning mt-3 py-2">{formError}</div>}
        </form>
    );
}

export default SummaryForm;