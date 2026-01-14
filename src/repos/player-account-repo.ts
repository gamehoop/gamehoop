import { PlayerAccount } from '@/db/schema';
import { BaseRepo } from './base-repo';

export class PlayerAccountRepo extends BaseRepo<PlayerAccount> {
  constructor() {
    super('playerAccount');
  }
}

export const playerAccountRepo = new PlayerAccountRepo();
