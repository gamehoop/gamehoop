import { db } from '@/db';
import { Game } from '@/db/types';
import { Organization, User } from '@/lib/auth';
import { createTestUser } from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { gameStore } from '../game-store';

describe('BaseStore', () => {
  let user: User;
  let organization: Organization;

  beforeEach(async () => {
    const result = await createTestUser();
    user = result.user;
    organization = result.organization;
  });

  describe('create', () => {
    it('should create a game', async () => {
      const { count: countBefore } = await db
        .selectFrom('game')
        .select((b) => b.fn.countAll().as('count'))
        .executeTakeFirstOrThrow();

      const values = {
        name: faker.lorem.words(),
        genre: 'action',
        platforms: ['windows'],
        sdk: 'godot',
        organizationId: organization.id,
        createdBy: user.id,
        updatedBy: user.id,
      };

      const game = await gameStore.create(values);
      expect(game).toEqual({
        ...values,
        id: expect.any(Number),
        publicId: expect.any(String),
        logo: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const { count: countAfter } = await db
        .selectFrom('game')
        .select((b) => b.fn.countAll().as('count'))
        .executeTakeFirstOrThrow();
      expect(Number(countAfter)).toEqual(Number(countBefore) + 1);
    });
  });

  describe('findOne', () => {
    it('should find a game by id', async () => {
      const game = await createMockGame();

      const foundGame = await gameStore.findOne({
        where: { id: game.id },
      });
      expect(foundGame).toEqual(game);
    });

    it('should find a game by platforms and createdBy', async () => {
      const game = await createMockGame();
      await createMockGame();

      const foundGame = await gameStore.findOne({
        where: { platforms: game.platforms, createdBy: game.createdBy },
      });
      expect(foundGame).toEqual(game);
    });

    it('should return undefined if the game does not exist', async () => {
      const foundGame = await gameStore.findOne({
        where: { id: faker.number.int({ max: 10 }) },
      });
      expect(foundGame).toBeUndefined();
    });
  });

  describe('findOneOrThrow', () => {
    it('should find a game by id', async () => {
      const game = await createMockGame();

      const foundGame = await gameStore.findOneOrThrow({
        where: { id: game.id },
      });
      expect(foundGame).toEqual(game);
    });

    it('should find a game by platforms and createdBy', async () => {
      const game = await createMockGame();
      await createMockGame();

      const foundGame = await gameStore.findOneOrThrow({
        where: { platforms: game.platforms, createdBy: game.createdBy },
      });
      expect(foundGame).toEqual(game);
    });

    it('should throw an error if the game does not exist', async () => {
      await expect(
        gameStore.findOneOrThrow({
          where: { id: faker.number.int({ max: 10 }) },
        }),
      ).rejects.toThrowError('No record found');
    });
  });

  describe('findMany', () => {
    it('should find multiple games by createdBy', async () => {
      const game1 = await createMockGame();
      const game2 = await createMockGame();

      const foundGames = await gameStore.findMany({
        where: { createdBy: game1.createdBy },
      });
      expect(foundGames).toEqual(expect.arrayContaining([game1, game2]));
      expect(foundGames.length).toEqual(2);
    });

    it('should return an empty array if no games match the criteria', async () => {
      const foundGames = await gameStore.findMany({
        where: { createdBy: faker.string.uuid() },
      });
      expect(foundGames).toEqual([]);
    });
  });

  describe('updateOne', () => {
    it('should update a game by id', async () => {
      const game = await createMockGame();

      const updatedName = faker.lorem.words();
      await gameStore.updateOne({
        where: { id: game.id },
        data: { name: updatedName, updatedBy: user.id },
      });
      const updatedGame = await gameStore.findOne({ where: { id: game.id } });

      expect(updatedGame).toEqual({
        ...game,
        name: updatedName,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('updateOneOrThrow', () => {
    it('should update a game by id', async () => {
      const game = await createMockGame();

      const updatedName = faker.lorem.words();
      const updatedGame = await gameStore.updateOneOrThrow({
        where: { id: game.id },
        data: { name: updatedName, updatedBy: user.id },
      });

      expect(updatedGame).toEqual({
        ...game,
        name: updatedName,
        updatedAt: expect.any(Date),
      });
    });

    it('should throw an error if the game does not exist', async () => {
      await expect(
        gameStore.updateOneOrThrow({
          where: { id: faker.number.int({ max: 10 }) },
          data: { name: faker.lorem.words(), updatedBy: user.id },
        }),
      ).rejects.toThrowError('Record not found');
    });
  });

  describe('deleteMany', () => {
    it('should delete games by id', async () => {
      const game1 = await createMockGame();
      const game2 = await createMockGame();

      await gameStore.deleteMany({
        where: { id: game1.id },
      });

      const foundGame1 = await gameStore.findOne({ where: { id: game1.id } });
      const foundGame2 = await gameStore.findOne({ where: { id: game2.id } });

      expect(foundGame1).toBeUndefined();
      expect(foundGame2).toEqual(game2);
    });

    it('should delete games by createdBy', async () => {
      const game1 = await createMockGame();
      const game2 = await createMockGame();

      await gameStore.deleteMany({
        where: { createdBy: game1.createdBy },
      });

      const foundGame1 = await gameStore.findOne({ where: { id: game1.id } });
      const foundGame2 = await gameStore.findOne({ where: { id: game2.id } });

      expect(foundGame1).toBeUndefined();
      expect(foundGame2).toBeUndefined();
    });
  });

  function createMockGame(): Promise<Game> {
    return gameStore.create({
      name: faker.lorem.words(),
      genre: faker.helpers.arrayElement([
        'action',
        'puzzle',
        'platformer',
        'adventure',
      ]),
      platforms: faker.helpers.arrayElements([
        'windows',
        'linux',
        'android',
        'ios',
      ]),
      sdk: faker.helpers.arrayElement(['unity', 'godot']),
      organizationId: organization.id,
      createdBy: user.id,
      updatedBy: user.id,
    });
  }
});
