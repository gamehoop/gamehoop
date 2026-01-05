import { PlayerSession } from '@/db/schema';
import { BaseStore } from './base-store';

export class PlayerSessionStore extends BaseStore<PlayerSession> {
  constructor() {
    super('playerSession');
  }
}

export const playerSessionStore = new PlayerSessionStore();
