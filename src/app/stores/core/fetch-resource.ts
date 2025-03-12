import { action, computed, makeObservable, observable } from 'mobx';
import { RestService } from './rest-service';
import {
  PaginationQuery,
  Query,
  QueryStatus,
  PaginationResponse,
} from './queries';

export class FetchResource<Types, Key extends string> {
  public rest: RestService<Types>;
  @observable.deep
  public queries: Record<Key, Query | PaginationQuery>;
  private _queries: Record<Key, Query | PaginationQuery>;

  constructor(queries: Record<Key, Query | PaginationQuery>) {
    makeObservable(this);

    this.rest = new RestService();
    this.queries = queries;
    this._queries = queries;
  }

  @computed
  get statuses() {
    return this.rest.statuses;
  }

  public getStatus = <T>(
    key: string
  ): ReturnType<typeof this.rest.getStatus<T>> => {
    return this.rest.getStatus<T>(key);
  };

  public getPaginationStatus<S>(
    keys: string[]
  ): QueryStatus<PaginationResponse<S>> {
    const status = keys.reduce<unknown>((acc, key) => {
      let result = (
        acc as QueryStatus<PaginationResponse<unknown>>
      ).copyWith() as QueryStatus<PaginationResponse<unknown>>;

      const pageStatus = this.getStatus(key) as QueryStatus<
        PaginationResponse<unknown>
      >;

      if (pageStatus.data) {
        const data = [
          ...(result?.data?.data ?? []),
          ...(pageStatus.data?.data ?? []),
        ];

        result = result.copyWith({
          ...result,
          ...pageStatus,

          data: {
            ...result.data,
            ...(pageStatus.data ?? {}),
            data,
          },
        });
      } else {
        result = result.copyWith({
          ...result,
          ...pageStatus,
          data: {
            count: 0,
            lastId: 0,
            page: 0,
            limit: 0,
            data: [],
            ...(result.data ?? {}),
          },
        });
      }

      return result;
    }, new QueryStatus<PaginationResponse<unknown>>());

    return status as QueryStatus<PaginationResponse<S>>;
  }

  public setQuery = action((key: Key, query: Query | PaginationQuery): void => {
    this.queries[key] = query;
  });

  public resetQuery = action((key: Key): void => {
    this.queries[key] = this._queries[key];
  });
}
