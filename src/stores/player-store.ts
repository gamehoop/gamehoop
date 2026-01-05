import { Player } from '@/db/schema';
import { BaseStore } from './base-store';

export class PlayerStore extends BaseStore<Player> {
  constructor() {
    super('player');
  }
}

export const playerStore = new PlayerStore();
