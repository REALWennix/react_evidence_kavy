import React, { useMemo } from 'react';

function SummaryTable({ data, tableStyle = 'light' }) {

  const { sortedData, totalCount } = useMemo(() => {
    if (!data) return { sortedData: [], totalCount: 0 };
    const numericData = data.map(item => [item[0], parseInt(item[1], 10) || 0]);
    const sorted = [...numericData].sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((sum, item) => sum + item[1], 0);
    return { sortedData: sorted, totalCount: total };
  }, [data]);

  if (sortedData.length === 0) return null;

  const tableClasses = `table table-${tableStyle} table-striped table-hover mb-0 align-middle`;
  const theadClass = tableStyle === 'dark' ? 'thead-dark' : 'table-light';
  const totalRowClass = tableStyle === 'dark' ? 'table-secondary' : 'table-secondary';

  return (
    <div className="table-responsive border rounded shadow-sm summary-table-wrapper">
      <table className={tableClasses}>
        <thead className={theadClass}>
          <tr><th scope="col">Nápoj</th><th scope="col" className="text-end">Počet</th></tr>
        </thead>
        <tbody>
          {sortedData.map((entry, index) => (
            <tr key={`${entry[0]}-${index}`}><td>{entry[0]}</td><td className="text-end">{entry[1]}</td></tr>
          ))}
          <tr className={totalRowClass}><td className="fw-bold">Celkem</td><td className="text-end fw-bold">{totalCount}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

export default SummaryTable;