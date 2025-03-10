import { QueryInterface } from './types';
import { AbstractQuery } from './abstract-query';

export class Query extends AbstractQuery {
  public copyWith = (data?: Partial<QueryInterface>): Query => {
    return new Query({ ...this, ...data });
  };

  static isInstance(value: unknown): value is Query {
    return value instanceof Query;
  }
}
