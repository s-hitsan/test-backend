export type UserType = {
  id: number;
  name: string;
  email: string;
};
export type DbType = { users: UserType[] };

const db: DbType = {
  users: [
    { id: 1, name: 'John', email: 'john@gmail.com' },
    { id: 2, name: 'Max', email: 'john@gmail.com' },
    { id: 3, name: 'Week', email: 'john@gmail.com' },
    { id: 4, name: 'Lock', email: 'john@gmail.com' },
  ],
};

export const usersRepository = {
  getUsers(term?: string) {
    if (!term) {
      return db.users;
    }
    return db.users.filter((user) => user.name.indexOf(term as string) > -1);
  },
  addUser(user: Omit<UserType, 'id'>) {
    const newUser = { id: +new Date(), ...user };
    db.users.push(newUser);
    return newUser;
  },
  findUserById(id: number) {
    return db.users.find((user) => user.id === id);
  },
  deleteUser(id: number) {
    db.users = db.users.filter((user) => user.id !== id);
  },
  setUserName(id: number, name: string) {
    const foundUser = db.users.find((user) => user.id === id);
    if (foundUser) {
      foundUser.name = name;
    }
  },
  clearUsers() {
    db.users = [];
  },
};
