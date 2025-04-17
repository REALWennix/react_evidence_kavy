import React from 'react';
import { getDrinkBadgeClass } from '../utils/drinkStyles'; 

function SelectedDrinkBadge({ drink, index, onRemoveDrink, disabled }) {
  if (!drink || drink.ID === undefined || !drink.typ) {
      console.warn("SelectedDrinkBadge received invalid drink prop:", drink);
      return null;
  }

  const badgeClass = getDrinkBadgeClass(drink.typ);

  return (
    <span
      key={`${drink.ID}-${index}-${Math.random()}`}
      className={`selected-drink-item badge me-1 mb-1 ${badgeClass}`}
    >
      {drink.typ}
      <button
        type="button"
        className="btn-close ms-1 p-1 lh-1"
        style={{fontSize: '0.8em', verticalAlign: 'middle'}}
        onClick={() => onRemoveDrink(index)}
        disabled={disabled}
        title="Odebrat"
        aria-label={`Odebrat ${drink.typ}`}
      ></button>
    </span>
  );
}

export default SelectedDrinkBadge;