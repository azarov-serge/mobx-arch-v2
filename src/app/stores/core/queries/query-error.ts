import { QueryErrorData } from './types';

export class QueryError implements QueryErrorData {
  public readonly status: number;
  public readonly message: string;

  constructor(data: QueryErrorData) {
    this.status = data.status;
    this.message = data.message;
  }
}
