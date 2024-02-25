import { OUT_DIR } from '../config/directory';
import { Lowdb } from '../libs/db/Lowdb';

export class LocalState {
  private static db: Lowdb;

  private static async initialize() {
    try {
      this.db = new Lowdb(OUT_DIR + '/db.json');
      await this.db.setParentObject('data');
    } catch (error) {
      console.log(`Failed to initialize local state: ${error}`);
      console.log(error);
    }
  }

  public static async set(key: string, value: string) {
    try {
      await this.initialize();
      await this.db.set(key, value);
    } catch (error) {
      console.log(`Failed to save Key: ${key} - Value: ${value}`);
      console.log(error);
    }
  }

  public static async get(key: string) {
    try {
      await this.initialize();
      await this.db.getAll();
    } catch (error) {
      console.log(`Failed to get value for Key: ${key}`);
      console.log(error);
    }
  }
}
