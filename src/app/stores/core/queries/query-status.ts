import { QueryError } from './query-error';

export class QueryStatus<T> {
  public readonly isFetching: boolean = false;
  public readonly isFetched: boolean = false;
  public readonly data: T | null = null;
  public readonly error: QueryError | null = null;

  constructor(data?: Partial<QueryStatus<T> | undefined>) {
    this.isFetching = data?.isFetching ?? this.isFetching;
    this.isFetched = data?.isFetched ?? this.isFetched;
    this.data = data?.data ?? this.data;
    this.error = data?.error ?? this.error;
  }

  public copyWith = (
    data?: Partial<QueryStatus<T>> | undefined
  ): QueryStatus<T> => {
    return new QueryStatus({ ...this, ...data });
  };
}
