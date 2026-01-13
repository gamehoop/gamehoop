import { PlayerAccount } from '@/db/schema';
import { BaseStore } from './base-store';

export class PlayerAccountStore extends BaseStore<PlayerAccount> {
  constructor() {
    super('playerAccount');
  }
}

export const playerAccountStore = new PlayerAccountStore();
