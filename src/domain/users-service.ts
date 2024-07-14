import { usersRepository } from '../repositories/users-repository';
import { UserType } from '../repositories/db';

export const usersService = {
  async getUsers(term?: string, skip?: string): Promise<UserType[]> {
    return await usersRepository.getUsers(term, skip ? +skip : 0, 10);
  },
  async findUserById(id: number) {
    return await usersRepository.findUserById(id);
  },
  async addUser(user: Omit<UserType, 'id'>): Promise<UserType | null> {
    const newUser = { id: +new Date(), email: user.email, name: user.name };
    const result = await usersRepository.addUser(newUser);
    if (result.acknowledged) {
      return newUser;
    }
    return null;
  },
  async deleteUser(id: number) {
    return await usersRepository.deleteUser(id);
  },
  async setUserName(id: number, name: string) {
    return await usersRepository.setUserName(id, name);
  },
  async clearUsers() {
    await usersRepository.clearUsers();
  },
};
