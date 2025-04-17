import React from 'react';
import { getDrinkButtonClass } from '../utils/drinkStyles';

function DrinkButton({ drink, onAddDrink, disabled }) {
  if (!drink || !drink.ID || !drink.typ) {
    console.warn("DrinkButton received invalid drink prop:", drink);
    return null; 
  }

  const buttonClass = getDrinkButtonClass(drink.typ);

  return (
    <button
      key={drink.ID} 
      className={`btn m-2 ${buttonClass}`}
      onClick={() => onAddDrink(drink)} 
      disabled={disabled}
      title={drink.typ}
    >
      {drink.typ}
    </button>
  );
}

export default DrinkButton;