import { PlayerSession } from '@/db/schema';
import { BaseRepo } from './base-repo';

export class PlayerSessionRepo extends BaseRepo<PlayerSession> {
  constructor() {
    super('playerSession');
  }
}

export const playerSessionRepo = new PlayerSessionRepo();
