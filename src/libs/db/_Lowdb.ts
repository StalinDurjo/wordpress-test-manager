import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';

type DataSchema = {
  [key: string]: any;
};

export class Lowdb {
  private db;

  // parentObject - represents the name of main object in database in which values will be stored when new instance of LowDB is created
  private parentObject: string = '';
  private defaultData = {};

  constructor(databaseFilePath: string) {
    const adapter = new JSONFileSync<DataSchema>(databaseFilePath);
    this.db = new LowSync<DataSchema>(adapter, this.defaultData);

    // import('lowdb').then((module) => {
    //   console.log(module);
    // });
  }

  // initialize - must be called before every operation, otherwise will overwrite the entire database object and will not retain previously stored values
  private initialize(): void {
    try {
      this.db.read();
    } catch (error) {
      console.log(`Failed to initialize db. ${error}`);
    }
  }

  // setParent - creates an object in database (if not already created), where all key & values will be stored
  setParent(parentObjectName: string): void {
    try {
      this.initialize();

      if (!this.db.data[parentObjectName]) {
        // checks if parent object is present
        this.db.data[parentObjectName] = {}; // create new parent object in database
        this.db.write();
      }
    } catch (error) {
      console.log(`Failed to set parent object: setParent() method`);
      console.error(error);
    }

    this.parentObject = parentObjectName;
  }

  // getAll - returns all objects and its keys & values present in the database
  getAll(): DataSchema {
    try {
      this.initialize();
    } catch (error) {
      console.log(`Failed to fetch all data: getAll() method`);
      console.error(error);
    }

    return this.db.data;
  }

  // set - updates values in database, if key is not present, it will automatically create it
  set(key: string, value: any): void {
    try {
      this.initialize();
      this.db.data[this.parentObject][key] = value;
      this.db.write();
    } catch (error) {
      console.log(`Failed to set data: set() method`);
      console.error(error);
    }
  }

  // get - returns value of a particular key
  get(key: string) {
    try {
      this.initialize();
    } catch (error) {
      console.log(`Failed to fetch data: get() method`);
      console.error(error);
    }

    return this.db.data[this.parentObject][key];
  }

  // clear - removes value of specific key in the parent object of database
  clear(key: string): void {
    try {
      this.initialize();
      this.db.data[this.parentObject][key] = '';
      this.db.write();
    } catch (error) {
      console.log(`Failed to clear data: clear() method`);
      console.error(error);
    }
  }

  // removeAll - deletes everything inside the parent object, it doesn't impact any other parent objects present in DB
  removeAll(): void {
    try {
      this.initialize();
      this.db.data[this.parentObject] = {};
      this.db.write();
    } catch (error) {
      console.log(`Failed to remove all data: removeAll() method`);
      console.error(error);
    }
  }
}
