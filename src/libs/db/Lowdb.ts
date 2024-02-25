export class Lowdb {
  private defaultData: any = {};
  private filePath: string;
  private parentObject: string = '';

  constructor(dbFilePath: string) {
    this.filePath = dbFilePath;
  }

  private async importDatabaseModule() {
    return await import('lowdb/node');
  }

  private async dbConnection() {
    const module = await this.importDatabaseModule();
    return module.JSONFileSyncPreset(this.filePath, this.defaultData);
  }

  async setParentObject(parentObjectName: string) {
    try {
      const db = await this.dbConnection();

      if (!db.data[parentObjectName]) {
        // checks if parent object is present
        db.data[parentObjectName] = {}; // create new parent object in database
        db.write();
      }
    } catch (error) {
      console.log(`Failed to set parent object: Lowdb`);
      console.error(error);
    }

    this.parentObject = parentObjectName;
  }

  async set(key: string, value: any) {
    try {
      const db = await this.dbConnection();
      db.data[this.parentObject][key] = value;
      db.write();
    } catch (error) {
      console.log(`Failed to set data: Lowdb`);
      console.log(error);
    }
  }

  async get(key: string) {
    try {
      const db = await this.dbConnection();
      return await db.data[this.parentObject][key];
    } catch (error) {
      console.log(`Failed to get data: Lowdb`);
      console.log(error);
    }
  }

  async getAll() {
    try {
      const db = await this.dbConnection();
      return await db.data[this.parentObject];
    } catch (error) {
      console.log(`Failed to get all data: Lowdb`);
      console.log(error);
    }
  }
}
