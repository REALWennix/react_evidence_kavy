import React, { useState, useEffect, useMemo, useCallback } from 'react';
import DrinkSelector from './components/DrinkSelector.jsx';
import SummaryViewer from './components/SummaryViewer.jsx';
import './App.css';

const API_URL = "http://ajax1.lmsoft.cz/procedure.php";
const USERNAME = "coffe";
const PASSWORD = "kafe";

function App() {
  const [users, setUsers] = useState([]);
  const [drinkTypes, setDrinkTypes] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [configError, setConfigError] = useState('');

  const basicAuth = useMemo(() => `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`, []);

  const fetchData = useCallback(async (cmd) => {
    let response; 
    try {
      const url = `${API_URL}?cmd=${cmd}&_=${new Date().getTime()}`;
      response = await fetch(url, { 
        headers: {
          "Authorization": basicAuth,
          "Accept": "application/json"
         }
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
             throw new Error(`Authentication Required (401).`);
        }
        throw new Error(`HTTP ${response.status} for ${cmd}: ${errorText || response.statusText}`);
      }
      const data = await response.json();
      return data;

    } catch (error) {
       if (error.message.includes("401")) {
           throw new Error("Chyba autentizace. Zkontrolujte přihlašovací údaje.");
       }
       if (error instanceof SyntaxError) {
          throw new Error(`API vrátilo neplatná data pro ${cmd}.`);
       }
       console.error(`Failed to fetch or parse ${cmd}:`, error);
       throw new Error(error.message || `Chyba při komunikaci se serverem (${cmd}).`);
    }
  }, [basicAuth]);

  useEffect(() => {
    setIsLoadingConfig(true);
    setConfigError('');

    Promise.all([
      fetchData('getPeopleList'),
      fetchData('getTypesList')
    ])
    .then(([rawPeopleData, rawTypesData]) => {
      const peopleData = Array.isArray(rawPeopleData) ? rawPeopleData : Object.values(rawPeopleData || {});
      const typesData = Array.isArray(rawTypesData) ? rawTypesData : Object.values(rawTypesData || {});

      if (!Array.isArray(peopleData)) { throw new Error("Nepodařilo se zpracovat formát seznamu uživatelů."); }
      if (!Array.isArray(typesData)) { throw new Error("Nepodařilo se zpracovat formát typů nápojů."); }

      setUsers(peopleData);
      setDrinkTypes(typesData);

      if (peopleData.length > 0 && peopleData[0]?.ID) {
        setSelectedUserId(peopleData[0].ID.toString());
      } else {
         setSelectedUserId('');
      }
    })
    .catch(error => {
      setConfigError(`Nepodařilo se načíst základní data: ${error.message}`);
      setUsers([]); setDrinkTypes([]); setSelectedUserId('');
    })
    .finally(() => {
      setIsLoadingConfig(false);
    });
  }, [fetchData]);

  const handleUserChange = (event) => {
    setSelectedUserId(event.target.value);
  };

  return (
    <div className="container my-4 my-md-5">
      <header className="text-center mb-5">
        <h1 className="display-5 fw-bold">Evidence kávy</h1>
      </header>

      {isLoadingConfig && (
        <div className="alert alert-info d-flex align-items-center" role="status">
          <div className="spinner-border spinner-border-sm me-2" role="status">
             <span className="visually-hidden">Načítám...</span>
          </div>
           Načítám seznam uživatelů a typů nápojů...
        </div>
      )}
      {configError && !isLoadingConfig && (
         <div className="alert alert-danger" role="alert">{configError}</div>
      )}

      {!isLoadingConfig && !configError && (
        <>
          <div className="row justify-content-center mb-5">
            <div className="col-md-8 col-lg-7">
               {users.length > 0 ? (
                    <div className="user-selector">
                        <label htmlFor="userSelect" className="form-label">Kdo pije?</label>
                        <select
                            id="userSelect"
                            className="form-select form-select-lg"
                            value={selectedUserId}
                            onChange={handleUserChange}
                        >
                             <option value="" disabled={selectedUserId !== ''}>-- Vyberte uživatele --</option>
                            {users.map(user => (
                                <option key={user.ID} value={user.ID}>{user.name}</option>
                            ))}
                        </select>
                    </div>
               ) : (
                    <div className="alert alert-warning text-center">V systému nejsou definovaní žádní uživatelé.</div>
               )}
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body p-4">
               <h2 className="card-title h5 text-uppercase mb-4">Vyberte nápoj</h2>
              {!selectedUserId && users.length > 0 && (
                <div className="alert alert-info">Nejprve vyberte uživatele.</div>
              )}
              {selectedUserId && drinkTypes.length === 0 && (
                 <div className="alert alert-warning">V systému nejsou definované žádné typy nápojů.</div>
              )}
              {selectedUserId && drinkTypes.length > 0 && (
                <DrinkSelector
                  apiUrl={API_URL}
                  authHeader={basicAuth}
                  userId={selectedUserId}
                  drinkTypes={drinkTypes}
                />
              )}
            </div>
          </div>

          <div className="card">
             <div className="card-body p-4">
                 <h2 className="card-title h5 text-uppercase mb-4">Měsíční přehled</h2>
                 <SummaryViewer
                     apiUrl={API_URL}
                     authHeader={basicAuth}
                 />
             </div>
          </div>
        </>
      )}

       <footer className="text-center mt-5 pt-4 border-top">
          <p>© {new Date().getFullYear()} Moje Kávová Aplikace</p>
       </footer>
    </div>
  );
}

export default App;