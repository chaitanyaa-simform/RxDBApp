import {createRxDatabase} from 'rxdb';
import {addPouchPlugin, getRxStoragePouch} from 'rxdb/plugins/pouchdb';
import heroSchema from '../schema/HeroSchema';

addPouchPlugin(require('pouchdb-adapter-idb'));
export const HeroesCollectionName = 'heroes';
const dbName = 'heroesDb';

const initializeDb = async () => {
  const db = await createRxDatabase({
    name: dbName, // <- name
    storage: getRxStoragePouch('idb'), // <- RxStorage
    password: '12345678', // <- password (optional)
    multiInstance: true, // <- multiInstance (optional, default: true)
    eventReduce: true, // <- eventReduce (optional, default: true)
    cleanupPolicy: {}, // <- custom cleanup policy (optional)
  });
  console.log('Database Initialized', db);

  // add collections
  await db.addCollections({
    [HeroesCollectionName]: {
      schema: heroSchema,
    },
  });

  // insert a document
  await db[HeroesCollectionName].insert({
    name: 'Bob',
    color: '#CFC82D',
  });

  return db;
};
export default initializeDb;
