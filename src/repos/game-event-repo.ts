import { GameEvent } from '@/db/schema';
import { BaseRepo } from './base-repo';

export class GameEventRepo extends BaseRepo<GameEvent> {
  constructor() {
    super('gameEvent');
  }
}

export const gameEventRepo = new GameEventRepo();
