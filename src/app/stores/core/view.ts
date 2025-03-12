import { action, computed, makeObservable } from 'mobx';
import { QueryHelpers, PaginationQueryHelpers } from './types';
import {
  PaginationQuery,
  PaginationQueryInterface,
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

  @computed
  get statuses() {
    return this._service.rest.statuses;
  }

  @computed
  get queries() {
    return this._service.queries;
  }

  public resetAll = (): void => {
    this._service.rest.resetAll();
  };

  protected createHelpers(key: Key): QueryHelpers {
    if (!this.helpers[key]) {
      const clearError = (args?: QueryInterface): void => {
        const query = this.queries[key];
        this._service.rest.clearError(query.copyWith(args).key);
      };

      const reset = (args?: QueryInterface): void => {
        const query = this.queries[key];
        this._service.rest.reset(query.copyWith(args).key);
      };

      const resetQuery = (): void => {
        const query = this.queries[key];
        this._service.rest.reset(query.keyShort);
        this._service.resetQuery(key);
      };

      this.setHelpers(key, {
        clearError,
        reset,
        resetQuery,
      } as QueryHelpers);
    }

    return this.helpers[key] as QueryHelpers;
  }

  protected createPaginationHelpers(key: Key): PaginationQueryHelpers {
    if (!this.paginationHelpers[key]) {
      const nextPage = (params: QueryParams) => {
        const query = this._service.queries[key] as PaginationQuery;
        const result = query.nextPage(params);

        this._service.setQuery(key, query.copyWith());

        return result;
      };

      const clearError = (args?: PaginationQueryInterface): void => {
        const query = this._service.queries[key] as PaginationQuery;
        this._service.rest.clearError(query.copyWith(args).key);
      };

      const reset = (args?: PaginationQueryInterface): void => {
        const query = this._service.queries[key] as PaginationQuery;
        this._service.rest.reset(query.copyWith(args).key);
      };

      const resetQuery = (): void => {
        const query = this._service.queries[key] as PaginationQuery;
        this._service.rest.resetQuery(query.keyShort);
        this._service.resetQuery(key);
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

  protected createQueryPaginationHelpers(
    query: PaginationQuery
  ): PaginationQueryHelpers {
    const clearError = (args?: PaginationQueryInterface): void => {
      this._service.rest.clearError(query.copyWith(args).key);
    };

    const reset = (args?: PaginationQueryInterface): void => {
      this._service.rest.reset(query.copyWith(args).key);
    };

    const resetQuery = (): void => {
      this._service.rest.resetQuery(query.keyShort);
    };

    return {
      clearError,
      reset,
      resetQuery,
    } as PaginationQueryHelpers;
  }

  private setHelpers = action((key: Key, helpers: QueryHelpers): void => {
    this.helpers[key] = helpers;
  });

  private setPaginationHelpers = action(
    (key: Key, helpers: PaginationQueryHelpers): void => {
      this.paginationHelpers[key] = helpers;
    }
  );
}
