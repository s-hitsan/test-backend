import { MongoClient } from 'mongodb';

export type UserType = {
  id: number;
  name: string;
  email: string;
};

export type AidListType = {
  id: number;
  title: string;
  description: string;
  sum: number;
};

export type FullAidType = {
  id: number;
  title: string;
  description: string;
  sum: number;
  link: string;
};

const mongoUri =
  process.env.MONGODB_URI ||
  'mongodb+srv://s_hitsan:Makaron098098@donate-control.ojf5p9j.mongodb.net/?retryWrites=true&w=majority&appName=donate-control';

const client = new MongoClient(mongoUri);
const db = client.db('donate-control');
export const usersCollection = db.collection<UserType>('users');
export const aidsCollection = db.collection<FullAidType>('aids');

export async function runDB() {
  try {
    console.log(mongoUri);
    console.log('try to connect to the DB...');
    //connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db('users').command({ ping: 1 });
    await client.db('aids').command({ ping: 1 });
    console.log('Connected successfully to mongo server');
  } catch (err) {
    console.log('error');
    console.log(err);
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
