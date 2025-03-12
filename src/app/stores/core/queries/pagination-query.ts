import {
  PageQueryParams,
  PaginationQueryInterface,
  QueryParams,
} from './types';
import { AbstractQuery } from './abstract-query';

export class PaginationQuery extends AbstractQuery {
  public page: number = 1;
  public pageParams: PageQueryParams = {};
  public pageLimit: PageQueryParams = {};

  constructor(data?: Partial<PaginationQueryInterface>) {
    super(data);

    this.page = data?.page ?? this.page;

    this.pageParams = {
      ...this.pageParams,
      ...(data?.pageParams ?? {}),
    };

    this.pageLimit = {
      ...this.pageLimit,
      ...(data?.pageLimit ?? {}),
    };

    if (data?.limit) {
      this.pageLimit[this.page] = data.limit;
    }

    this.params = { ...(data?.params ?? this.params) };
  }

  get url(): string {
    const params = this.pageParams[this.page] ?? {};
    const limit = this.getLimit();

    return this.createUrl({ ...this.params, ...params, ...limit });
  }

  get urls(): string[] {
    return Array.from({ length: this.page }).map((_, index) => {
      const page = index + 1;
      const params = this.pageParams[page] ?? {};
      const limit = this.getLimit(page);

      return this.createUrl({ ...this.params, ...params, ...limit });
    });
  }

  /** Уникальные ключи ресурса */
  get key(): string {
    return this.keys[this.page - 1];
  }

  /** Уникальные ключи ресурса */
  get keys(): string[] {
    return this.urls.map((url) => this.createKey(url));
  }

  get limit(): QueryParams {
    return this.getLimit();
  }

  public copyWith = (
    data?: Partial<PaginationQueryInterface>
  ): PaginationQuery => {
    return new PaginationQuery({ ...this, ...(data ?? {}) });
  };

  public nextPage = (params: QueryParams): boolean => {
    const currentParams = PaginationQuery.createParams({
      ...(this.pageParams[this.page] ?? {}),
    });

    const newParams = PaginationQuery.createParams(params);

    if (currentParams === newParams) {
      return false;
    }

    this.pageLimit[this.page + 1] = this.limit;

    this.page = this.page + 1;

    this.pageParams[this.page] = params;

    return true;
  };

  public getPaginationParamsValue = <T>(
    key: string,
    defaultValue?: T,
    page?: number
  ): T => {
    const params = this.pageParams[page ?? this.page] ?? {};
    return (params[key] ?? defaultValue) as T;
  };

  public setParams = (params: QueryParams): void => {
    if (
      PaginationQuery.createParams(params) !==
      PaginationQuery.createParams(this.params)
    ) {
      this.page = 1;
      this.pageParams = {};
      this.pageLimit = {
        1: { ...this.getLimit(1) },
      };
    }

    this.params = { ...params };
  };

  private getLimit = (page?: number): QueryParams => {
    return this.pageLimit[page ?? this.page] ?? {};
  };

  static isInstance(value: unknown): value is PaginationQuery {
    return value instanceof PaginationQuery;
  }
}
