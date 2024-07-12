import { usersCollection, UserType } from './db';

export const usersRepository = {
  async getUsers(term?: string): Promise<UserType[]> {
    let filter: any = {};

    if (term) {
      filter = { title: { $regex: term } };
    }
    return await usersCollection.find(filter).toArray();
  },
  async addUser(user: Omit<UserType, 'id'>): Promise<UserType> {
    const newUser = { id: +new Date(), email: user.email, name: user.name };
    await usersCollection.insertOne(newUser);
    return newUser;
  },
  async findUserById(id: number) {
    const user = await usersCollection.findOne({ id: id });
    if (user) return user;
    return null;
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
