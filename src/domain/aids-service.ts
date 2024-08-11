import { AidListType, FullAidType } from '../repositories/db';
import { aidsRepository } from '../repositories/aids-repository';

export const aidsService = {
  async getAids(term?: string, skip?: string): Promise<AidListType[]> {
    return await aidsRepository.getAids(term, skip ? +skip : 0, 10);
  },
  async findAidById(id: number) {
    return await aidsRepository.findAidById(id);
  },
  async addAid(aid: Omit<FullAidType, 'id'>): Promise<FullAidType | null> {
    const newAid = {
      id: +new Date(),
      title: aid.title,
      description: aid.description,
      sum: aid.sum,
      link: aid.link,
    };
    const result = await aidsRepository.addAid(newAid);
    if (result.acknowledged) {
      return newAid;
    }
    return null;
  },
  async deleteAid(id: number) {
    return await aidsRepository.deleteAid(id);
  },
  async setAidTitle(id: number, name: string) {
    return await aidsRepository.setAidTitle(id, name);
  },
  async clearAids() {
    await aidsRepository.clearAids();
  },
};
