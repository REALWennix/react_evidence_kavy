import React from 'react';

function StatusMessage({ message, type }) {
  if (!message) {
    return null;
  }

  const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';

  return (
    <div className={`alert ${alertClass} mt-3 mb-4`} role="alert">
      {message}
    </div>
  );
}

export default StatusMessage;