import { usersCollection, UserType } from './db';
import { InsertOneResult } from 'mongodb';

export const usersRepository = {
  async getUsers(term?: string, skip?: number, limit?: number): Promise<UserType[]> {
    let filter: any = {};

    if (term) {
      filter = { title: { $regex: term } };
    }
    return await usersCollection
      .find(filter)
      .skip(skip || 0)
      .limit(limit || 10)
      .toArray();
  },
  async getUsersTotalCount(): Promise<number> {
    return await usersCollection.countDocuments();
  },
  async findUserById(id: number) {
    return await usersCollection.findOne({ id: id });
  },
  async addUser(user: UserType): Promise<InsertOneResult<UserType>> {
    return await usersCollection.insertOne(user);
  },
  async deleteUser(id: number) {
    const result = await usersCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },
  async setUserName(id: number, name: string) {
    const result = await usersCollection.updateOne({ id }, { $set: { name } });
    return result.matchedCount === 1;
  },
  async clearUsers() {
    await usersCollection.deleteMany({});
  },
};
