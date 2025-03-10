import {
  PageQueryParams,
  PaginationQueryInterface,
  QueryParams,
} from './types';
import { AbstractQuery } from './abstract-query';

export class PaginationQuery extends AbstractQuery {
  public page: number = 1;
  public readonly pageParams: PageQueryParams = {};

  constructor(data?: Partial<PaginationQueryInterface>) {
    super(data);

    this.page = data?.page ?? this.page;

    this.pageParams = {
      ...this.pageParams,
      ...(data?.pageParams ?? {}),
    };
  }

  get requestUrl(): string {
    const params = this.pageParams[this.page] ?? {};

    return this.createUrl({ ...this.params, ...params });
  }

  get requestUrls(): string[] {
    return Array.from({ length: this.page }).map((_, index) => {
      const page = index + 1;
      const params = this.pageParams[page] ?? {};

      return this.createUrl({ ...this.params, ...params });
    });
  }

  /** Уникальные ключи ресурса */
  get key(): string {
    return this.createKey(this.requestUrl);
  }

  /** Уникальные ключи ресурса */
  get keys(): string[] {
    return this.requestUrls.map((url) => this.createKey(url));
  }

  public copyWith = (
    data?: Partial<PaginationQueryInterface>
  ): PaginationQuery => {
    return new PaginationQuery({ ...this, ...(data ?? {}) });
  };

  public nextPage = (params: QueryParams): boolean => {
    const currentParams = PaginationQuery.createParams({
      ...this.params,
      ...(this.pageParams[this.page] ?? {}),
    });

    const newParams = PaginationQuery.createParams(params);

    if (currentParams === newParams) {
      return false;
    }

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

  static isInstance(value: unknown): value is PaginationQuery {
    return value instanceof PaginationQuery;
  }
}
