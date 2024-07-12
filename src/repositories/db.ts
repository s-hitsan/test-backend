import { MongoClient } from 'mongodb';

export type UserType = {
  id: number;
  name: string;
  email: string;
};

const mongoUri = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/?maxPoolSize=20&w=majority';

const client = new MongoClient(mongoUri);
const db = client.db('donate-control');
export const usersCollection = db.collection<UserType>('users');

export async function runDB() {
  try {
    //connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db('users').command({ ping: 1 });
    console.log('Connected successfully to mongo server');
  } catch {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
