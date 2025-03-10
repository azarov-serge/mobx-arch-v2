import { action, computed, makeObservable } from 'mobx';
import { QueryHelpers, PaginationQueryHelpers } from './types';
import {
  PaginationQuery,
  PaginationQueryInterface,
  Query,
  QueryInterface,
  QueryParams,
} from './queries';
import { FetchResource } from './fetch-resource';

export class View<Service, Key extends string> {
  private readonly _service: FetchResource<unknown, Key>;
  protected helpers: Record<Key, QueryHelpers>;
  protected paginationHelpers: Record<Key, PaginationQueryHelpers>;

  constructor(service: Service) {
    makeObservable(this);

    this._service = service as FetchResource<unknown, Key>;
    this.helpers = {} as Record<Key, QueryHelpers>;
    this.paginationHelpers = {} as Record<Key, PaginationQueryHelpers>;
  }

  get service(): Service {
    return this._service as unknown as Service;
  }

  public resetAll = (): void => {
    this._service.rest.resetAll();
  };

  protected createHelpers(key: Key, query: Query): QueryHelpers {
    if (!this.helpers[key]) {
      const clearError = (args?: QueryInterface): void => {
        this._service.rest.clearError(query.copyWith(args).key);
      };

      const reset = (args?: QueryInterface): void => {
        this._service.rest.reset(query.copyWith(args).key);
      };

      const resetQuery = (): void => {
        this._service.rest.reset(query.keyShort);
      };

      this.setHelpers(key, {
        clearError,
        reset,
        resetQuery,
      } as QueryHelpers);
    }

    return this.helpers[key] as QueryHelpers;
  }

  protected createPaginationHelpers(
    key: Key,
    query: PaginationQuery
  ): PaginationQueryHelpers {
    if (!this.paginationHelpers[key]) {
      const nextPage = (params: QueryParams) => {
        const result = query.nextPage(params);
        this._service.setQuery(key, query.copyWith());

        return result;
      };

      const clearError = (args?: PaginationQueryInterface): void => {
        this._service.rest.clearError(query.copyWith(args).key);
      };

      const reset = (args?: PaginationQueryInterface): void => {
        this._service.rest.reset(query.copyWith(args).key);
      };

      const resetQuery = (): void => {
        this._service.rest.resetQuery(query.keyShort);
      };

      this.setPaginationHelpers(key, {
        nextPage,
        clearError,
        reset,
        resetQuery,
      } as PaginationQueryHelpers);
    }

    return this.paginationHelpers[key] as PaginationQueryHelpers;
  }

  private setHelpers = action((key: Key, helpers: QueryHelpers): void => {
    this.helpers[key] = helpers;
  });

  private setPaginationHelpers = action(
    (key: Key, helpers: PaginationQueryHelpers): void => {
      this.paginationHelpers[key] = helpers;
    }
  );

  @computed
  get statuses() {
    return this._service.rest.statuses;
  }
}
