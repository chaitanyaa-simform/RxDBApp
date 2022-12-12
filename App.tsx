import React, { createContext, useEffect, useState } from 'react';
import { LogBox, SafeAreaView } from 'react-native';
import styles from './src/modules/Todos/styles';
import TodoList from './src/modules/Todos/TodosList';
import initializeDB from './src/store/database/InitializeDatabase';

export const AppContext = createContext({});

LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);

const App = () => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      const DB = await initializeDB();
      setDb(DB);
    };
    initDB().then();
  }, [db]);

  return (
    <AppContext.Provider value={{ db }}>
      <SafeAreaView style={styles.container}>
        <TodoList />
      </SafeAreaView>
    </AppContext.Provider>
  );
};

export default App;
