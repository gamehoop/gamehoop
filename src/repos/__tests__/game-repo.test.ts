import { db } from '@/db';
import { Game } from '@/db/types';
import { Organization, User } from '@/libs/auth';
import { createTestUser } from '@/utils/testing';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it } from 'vitest';
import { gameRepo } from '../game-repo';

describe('GameRepo', () => {
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

      const game = await gameRepo.create(values);
      expect(game).toStrictEqual({
        ...values,
        id: expect.any(String),
        logo: null,
        settings: null,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });

      const { count: countAfter } = await db
        .selectFrom('game')
        .select((b) => b.fn.countAll().as('count'))
        .executeTakeFirstOrThrow();
      expect(Number(countAfter)).toStrictEqual(Number(countBefore) + 1);
    });
  });

  describe('findOne', () => {
    it('should find a game by id', async () => {
      const game = await createMockGame();

      const foundGame = await gameRepo.findOne({
        where: { id: game.id },
      });
      expect(foundGame).toStrictEqual(game);
    });

    it('should find a game by platforms and createdBy', async () => {
      const game = await createMockGame();
      await createMockGame();

      const foundGame = await gameRepo.findOne({
        where: { platforms: game.platforms, createdBy: game.createdBy },
      });
      expect(foundGame).toStrictEqual(game);
    });

    it('should return undefined if the game does not exist', async () => {
      const foundGame = await gameRepo.findOne({
        where: { id: faker.string.uuid() },
      });
      expect(foundGame).toBeUndefined();
    });
  });

  describe('findOneOrThrow', () => {
    it('should find a game by id', async () => {
      const game = await createMockGame();

      const foundGame = await gameRepo.findOneOrThrow({
        where: { id: game.id },
      });
      expect(foundGame).toStrictEqual(game);
    });

    it('should find a game by platforms and createdBy', async () => {
      const game = await createMockGame();
      await createMockGame();

      const foundGame = await gameRepo.findOneOrThrow({
        where: { platforms: game.platforms, createdBy: game.createdBy },
      });
      expect(foundGame).toStrictEqual(game);
    });

    it('should throw an error if the game does not exist', async () => {
      await expect(
        gameRepo.findOneOrThrow({
          where: { id: faker.string.uuid() },
        }),
      ).rejects.toThrowError('No record found');
    });
  });

  describe('findMany', () => {
    it('should find multiple games by createdBy', async () => {
      const game1 = await createMockGame();
      const game2 = await createMockGame();

      const foundGames = await gameRepo.findMany({
        where: { createdBy: game1.createdBy },
      });
      expect(foundGames).toStrictEqual(expect.arrayContaining([game1, game2]));
      expect(foundGames.length).toStrictEqual(2);
    });

    it('should return an empty array if no games match the criteria', async () => {
      const foundGames = await gameRepo.findMany({
        where: { createdBy: faker.string.uuid() },
      });
      expect(foundGames).toStrictEqual([]);
    });
  });

  describe('page', () => {
    it('should paginate multiple games', async () => {
      const game1 = await createMockGame();
      const game2 = await createMockGame();
      const game3 = await createMockGame();

      const { total, items } = await gameRepo.page({
        where: { createdBy: game1.createdBy },
      });

      expect(total).toStrictEqual(3);
      expect(items).toStrictEqual(
        expect.arrayContaining([game3, game2, game1]),
      );
    });

    it('supports a given pageSize', async () => {
      const game1 = await createMockGame();
      await createMockGame();
      await createMockGame();

      const { total, items } = await gameRepo.page({
        pageSize: 1,
        where: { createdBy: game1.createdBy },
      });

      expect(total).toStrictEqual(3);
      expect(items).toStrictEqual([game1]);
    });

    it('supports a given page', async () => {
      const game1 = await createMockGame();
      const game2 = await createMockGame();
      await createMockGame();

      const { total, items } = await gameRepo.page({
        page: 2,
        pageSize: 1,
        where: { createdBy: game1.createdBy },
      });

      expect(total).toStrictEqual(3);
      expect(items).toStrictEqual([game2]);
    });
  });

  describe('count', () => {
    it('should count all rows in the table', async () => {
      const game = await createMockGame();
      await createMockGame();
      await createMockGame();

      const foundGames = await gameRepo.count({
        where: { createdBy: game.createdBy },
      });
      expect(foundGames).toStrictEqual(3);
    });
  });

  describe('update', () => {
    it('should update a game by id', async () => {
      const game = await createMockGame();

      const updatedName = faker.lorem.words();
      await gameRepo.update({
        where: { id: game.id },
        data: { name: updatedName, updatedBy: user.id },
      });
      const updatedGame = await gameRepo.findOne({ where: { id: game.id } });

      expect(updatedGame).toStrictEqual({
        ...game,
        name: updatedName,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('updateOrThrow', () => {
    it('should update a game by id', async () => {
      const game = await createMockGame();

      const updatedName = faker.lorem.words();
      const updatedGame = await gameRepo.updateOrThrow({
        where: { id: game.id },
        data: { name: updatedName, updatedBy: user.id },
      });

      expect(updatedGame).toStrictEqual({
        ...game,
        name: updatedName,
        updatedAt: expect.any(Date),
      });
    });

    it('should throw an error if the game does not exist', async () => {
      await expect(
        gameRepo.updateOrThrow({
          where: { id: faker.string.uuid() },
          data: { name: faker.lorem.words(), updatedBy: user.id },
        }),
      ).rejects.toThrowError('Record not found');
    });
  });

  describe('delete', () => {
    it('should delete games by id', async () => {
      const game1 = await createMockGame();
      const game2 = await createMockGame();

      await gameRepo.delete({
        where: { id: game1.id },
      });

      const foundGame1 = await gameRepo.findOne({ where: { id: game1.id } });
      const foundGame2 = await gameRepo.findOne({ where: { id: game2.id } });

      expect(foundGame1).toBeUndefined();
      expect(foundGame2).toStrictEqual(game2);
    });

    it('should delete games by createdBy', async () => {
      const game1 = await createMockGame();
      const game2 = await createMockGame();

      await gameRepo.delete({
        where: { createdBy: game1.createdBy },
      });

      const foundGame1 = await gameRepo.findOne({ where: { id: game1.id } });
      const foundGame2 = await gameRepo.findOne({ where: { id: game2.id } });

      expect(foundGame1).toBeUndefined();
      expect(foundGame2).toBeUndefined();
    });
  });

  function createMockGame(): Promise<Game> {
    return gameRepo.create({
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
