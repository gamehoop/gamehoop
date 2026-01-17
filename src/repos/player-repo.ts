import { Player } from '@/db/schema';
import { BaseRepo } from './base-repo';

export class PlayerRepo extends BaseRepo<Player> {
  constructor() {
    super('player');
  }
}

export const playerRepo = new PlayerRepo();
