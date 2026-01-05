import { db } from '@/db';
import { DB } from '@/db/schema';
import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export abstract class BaseStore<T> {
  private tableName: keyof DB;

  constructor(tableName: keyof DB) {
    this.tableName = tableName;
  }

  async findMany(args: FindManyArgs<T> = {}): Promise<Selectable<T>[]> {
    let query = db.selectFrom(this.tableName).selectAll();

    query = this.applyWhere(query, args.where);

    if (args.orderBy) {
      for (const [key, direction] of Object.entries(args.orderBy)) {
        query = query.orderBy(key as any, direction as OrderDirection);
      }
    }

    if (args.take !== undefined) {
      query = query.limit(args.take);
    }

    if (args.skip !== undefined) {
      query = query.offset(args.skip);
    }

    return query.execute() as unknown as Selectable<T>[];
  }

  async findOne(args: FindOneArgs<T> = {}): Promise<FindOneResult<T>> {
    let query = db.selectFrom(this.tableName).selectAll();
    return this.applyWhere(
      query,
      args.where,
    ).executeTakeFirst() as unknown as FindOneResult<T>;
  }

  async findOneOrThrow(args: FindOneArgs<T> = {}): Promise<Selectable<T>> {
    const result = await this.findOne(args);
    if (!result) {
      throw new Error(`No record found`);
    }
    return result;
  }

  async deleteMany(args: DeleteManyArgs<T> = {}): Promise<void> {
    let query = db.deleteFrom(this.tableName);
    await this.applyWhere(query, args.where).execute();
  }

  async updateMany(args: UpdateManyArgs<T> = { data: {} }): Promise<void> {
    let query = db.updateTable(this.tableName);

    await this.applyWhere(query, args.where).set(args.data).execute();
  }

  async updateOne(
    args: UpdateOneArgs<T> = { data: {} },
  ): Promise<UpdateOneResult<T>> {
    let query = db.updateTable(this.tableName);

    return this.applyWhere(query, args.where)
      .set(args.data)
      .returningAll()
      .executeTakeFirst() as Selectable<T>;
  }

  async updateOneOrThrow(
    args: UpdateOneArgs<T> = { data: {} },
  ): Promise<Selectable<T>> {
    const result = await this.updateOne(args);
    if (!result) {
      throw new Error('Record not found');
    }
    return result;
  }

  async create(data: Insertable<T>): Promise<Selectable<T>> {
    return db
      .insertInto(this.tableName)
      .values(data as any)
      .returningAll()
      .executeTakeFirstOrThrow() as unknown as Selectable<T>;
  }

  protected applyWhere(query: any, where?: Record<string, unknown>) {
    if (!where) {
      return query;
    }

    let q = query;
    for (const [key, value] of Object.entries(where)) {
      if (value !== undefined) {
        q = q.where(key as any, '=', value);
      }
    }
    return q;
  }
}

export type WhereInput<T> = {
  [K in keyof T]?: T[K] extends ColumnType<infer Select, any, any>
    ? Select
    : T[K];
};

export type OrderDirection = 'asc' | 'desc';

export type OrderByInput<T> = {
  [K in keyof T]?: OrderDirection;
};

export type FindManyArgs<T> = {
  where?: WhereInput<T>;
  orderBy?: OrderByInput<T>;
  take?: number;
  skip?: number;
};

export type FindOneArgs<T> = {
  where?: WhereInput<T>;
};

export type FindOneResult<T> = Selectable<T> | undefined;

export type DeleteManyArgs<T> = {
  where?: WhereInput<T>;
};

export type UpdateManyArgs<T> = {
  where?: WhereInput<T>;
  data: Updateable<T>;
};

export type UpdateOneArgs<T> = {
  where?: WhereInput<T>;
  data: Updateable<T>;
};

export type UpdateOneResult<T> = Selectable<T> | undefined;
