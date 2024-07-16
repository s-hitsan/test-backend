import { aidsCollection, AidType } from './db';
import { InsertOneResult } from 'mongodb';

export const aidsRepository = {
  async getAids(term?: string, skip?: number, limit?: number): Promise<AidType[]> {
    let filter: any = {};

    if (term) {
      filter = { title: { $regex: term } };
    }
    return await aidsCollection
      .find(filter)
      .skip(skip || 0)
      .limit(limit || 10)
      .toArray();
  },
  async getAidsTotalCount(): Promise<number> {
    return await aidsCollection.countDocuments();
  },
  async findAidById(id: number) {
    return await aidsCollection.findOne({ id: id });
  },
  async addAid(aid: AidType): Promise<InsertOneResult<AidType>> {
    return await aidsCollection.insertOne(aid);
  },
  async deleteAid(id: number) {
    const result = await aidsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  },
  async setAidTitle(id: number, name: string) {
    const result = await aidsCollection.updateOne({ id }, { $set: { name } });
    return result.matchedCount === 1;
  },
  async clearAids() {
    await aidsCollection.deleteMany({});
  },
};
