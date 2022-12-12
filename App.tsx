import React, {createContext, useEffect, useState} from 'react';
import Heros from './src/modules/Heros/Heros';
import initializeDb from './src/store/database/InitializeDatabase';

export const AppContext = createContext({});

const App = () => {
  const [db, setDb] = useState({});

  useEffect(() => {
    const initDB = async () => {
      const DB = await initializeDb();
      setDb(DB);
    };
    initDB().then();
  }, []);

  return (
    <AppContext.Provider value={{db}}>
      <Heros />
    </AppContext.Provider>
  );
};

export default App;
