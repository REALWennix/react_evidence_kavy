import React from 'react';

function DrinkActionButtons({
  onSave,
  onClear,
  isSaving,
  selectedCount,
  canClear
}) {
  return (
    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
      <button
        className="btn btn-success"
        onClick={onSave}
        disabled={selectedCount === 0 || isSaving} 
      >
        {isSaving ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Ukládám...
          </>
        ) : (
          `Uložit (${selectedCount})` 
        )}
      </button>
      <button
        className="btn btn-outline-secondary"
        onClick={onClear}
        disabled={!canClear || isSaving}
      >
        Vyčistit výběr
      </button>
    </div>
  );
}

export default DrinkActionButtons;