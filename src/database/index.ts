import { createConnection, getConnectionOptions } from 'typeorm';

export async function connectDatabase() {
  return await createConnection();
}
