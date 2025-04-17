import React, { useState } from 'react';
import DrinkButton from './DrinkButton.jsx';
import SelectedDrinkBadge from './SelectedDrinkBadge.jsx';
import DrinkActionButtons from './DrinkActionButtons.jsx';
import StatusMessage from './StatusMessage.jsx';

function DrinkSelector({ apiUrl, authHeader, userId, drinkTypes }) {
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ message: '', type: '' });

  const handleAddDrink = (drink) => {
      setSelectedDrinks(prevDrinks => [...prevDrinks, drink]);
      setSaveStatus({ message: '', type: '' });
  };

  const handleRemoveDrink = (indexToRemove) => {
      setSelectedDrinks(prevDrinks => prevDrinks.filter((_, index) => index !== indexToRemove));
  };

  const handleClearSelection = () => {
      setSelectedDrinks([]);
      setSaveStatus({ message: '', type: '' });
  };

  const handleSaveDrinks = async () => {
      if (selectedDrinks.length === 0 || isSaving || !userId) return;
      setIsSaving(true);
      setSaveStatus({ message: '', type: '' });

      const data = new URLSearchParams();
      data.append("user", userId);
      selectedDrinks.forEach(drink => { data.append("type[]", drink.ID.toString()); });

      try {
        const response = await fetch(`${apiUrl}?cmd=saveDrinks`, {
          method: "POST",
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Accept": "application/json"
          },
          body: data.toString()
        });

        if (!response.ok) {
             const errorText = await response.text();
             let errorMessage = `HTTP chyba ${response.status}`;
             if (response.status === 401) {
                 errorMessage = "Chyba autentizace (401).";
             } else {
                 try {
                     const errorJson = JSON.parse(errorText);
                     errorMessage = `HTTP chyba ${response.status}: ${errorJson.msg || errorText}`;
                 } catch { 
                     errorMessage = `HTTP chyba ${response.status}: ${errorText}`;
                 }
             }
             throw new Error(errorMessage);
        }

        const responseData = await response.json();

        if (responseData && responseData.msg === 1) {
             setSaveStatus({ message: "Nápoje byly úspěšně uloženy.", type: 'success' });
             setSelectedDrinks([]);
        } else {
              const serverMsg = responseData?.msg;
              throw new Error(`Server vrátil neočekávaný stav${serverMsg !== undefined ? `: ${serverMsg}` : '.'}`);
        }
      } catch (error) {
          console.error("Error during save operation:", error);
          setSaveStatus({ message: `Chyba při ukládání: ${error.message}`, type: 'error' });
      }
      finally {
          setIsSaving(false);
          setTimeout(() => setSaveStatus({ message: '', type: '' }), 5000);
      }
  };

  return (
    <div>
      <div className="mb-4 text-center drink-buttons d-flex flex-wrap justify-content-center">
        {drinkTypes.map((drink) => (
          <DrinkButton
            key={drink.ID}
            drink={drink}
            onAddDrink={handleAddDrink}
            disabled={isSaving}
          />
        ))}
      </div>

      <div className="selected-drinks-container border rounded p-3 mb-4" style={{ minHeight: '80px' }}>
        <strong className="me-2">Vybráno:</strong>
        {selectedDrinks.length === 0 ? (
          <span className="text-body-secondary fst-italic"> Žádný nápoj</span>
        ) : (
          <span className="d-inline-flex flex-wrap gap-1 align-items-center">
            {selectedDrinks.map((drink, index) => (
              <SelectedDrinkBadge
                key={`${drink.ID}-${index}-${Math.random()}`}
                drink={drink}
                index={index}
                onRemoveDrink={handleRemoveDrink}
                disabled={isSaving}
              />
            ))}
          </span>
        )}
      </div>

      <StatusMessage message={saveStatus.message} type={saveStatus.type} />

      <DrinkActionButtons
        onSave={handleSaveDrinks}
        onClear={handleClearSelection}
        isSaving={isSaving}
        selectedCount={selectedDrinks.length}
        canClear={selectedDrinks.length > 0}
      />
    </div>
  );
}

export default DrinkSelector;