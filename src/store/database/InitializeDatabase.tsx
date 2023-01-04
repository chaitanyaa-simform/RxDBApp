import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration';
import { addPouchPlugin, getRxStoragePouch } from 'rxdb/plugins/pouchdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import heroSchema from '../schema/HeroSchema';

addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

// add require plugins
addPouchPlugin(require('pouchdb-adapter-idb'));

export const HeroesCollectionName = 'heroes';
const dbName = 'heroesDb';

const isDevelopment =
  process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD === 'true';

const initializeDb = async () => {
  if (isDevelopment) {
    addRxPlugin(RxDBDevModePlugin);
  }

  let db: any;

  try {
    console.log('Initializing database...', isDevelopment);
    db = await createRxDatabase({
      name: dbName, // <- name
      storage: getRxStoragePouch('idb'), // <- RxStorage according to your Adapter
      password: '12345678', // <- password (optional)
      multiInstance: true, // <- multiInstance (optional, default: true)
      eventReduce: true, // <- eventReduce (optional, default: true)
      cleanupPolicy: {}, // <- custom cleanup policy (optional)
      ignoreDuplicate: true,
    });
    console.log('Database Initialized', db);
  } catch (err) {
    console.log('ERROR CREATING DATABASE', err);
  }

  // add collections
  try {
    console.log('Adding hero collection...');
    await db.addCollections({
      [HeroesCollectionName]: {
        schema: heroSchema,
      },
    });
  } catch (err) {
    console.log('ERROR CREATING COLLECTION', err);
  }

  // insert a document
  try {
    console.log('Inserting hero collection...');
    await db[HeroesCollectionName].insert({
      name: 'Bob',
      color: '#CFC82D',
    });
  } catch (err) {
    console.log('ERROR INSERTING DOCUMENTS', err);
  }

  return db;
};
export default initializeDb;
