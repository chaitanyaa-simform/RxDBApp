import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageMemory } from 'rxdb/plugins/memory';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

import { TodoSchema } from '../schema/TodoSchema';
export const STORAGE = getRxStorageMemory();
const dbName = 'todosreactdatabase';
export const todoCollectionName = 'todo';

const isDevelopment =
  process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true';

const initializeDB = async () => {
  if (isDevelopment) {
    addRxPlugin(RxDBDevModePlugin);
  }

  let db: any;

  try {
    db = await createRxDatabase({
      name: dbName,
      storage: STORAGE,
      multiInstance: false,
      ignoreDuplicate: true,
    });
  } catch (err) {
    console.log('ERROR CREATING DATABASE', err);
  }

  try {
    await db.addCollections({
      [todoCollectionName]: {
        schema: TodoSchema,
      },
    });
  } catch (err) {
    console.log('ERROR CREATING COLLECTION', err);
  }

  await db[todoCollectionName].insert({
    id: `${Date.now()}`,
    title: 'Antibiotics',
    description: 'Bring Medicine from store',
    done: 'true',
  });

  return db;
};

export default initializeDB;
