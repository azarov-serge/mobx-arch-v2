import { makeAutoObservable } from 'mobx';
import qs from 'query-string';

import { ResourceInterface, ResourceMethod } from './types';

export class PaginationResource implements ResourceInterface {
  private readonly id: string = '';
  public readonly method: ResourceMethod = 'GET';
  public limit: number = 10;
  public page: number = 1;

  private cursors: Record<string, string> = {};
  private _url: string = '';

  constructor(
    data?: Partial<
      ResourceInterface & {
        id: number | string;
        limit?: number;
      }
    >
  ) {
    makeAutoObservable(this);
    this.id = `${data?.id ?? this.id}`;
    this.method = data?.method ?? this.method;
    this.limit = data?.limit ?? this.limit;

    this._url = data?.url ? this.createUrl(this.page, data?.url) : this._url;

    this.copyWith = this.copyWith.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.setPage = this.setPage.bind(this);
    this.setParams = this.setParams.bind(this);
  }

  get url(): string {
    return this.createUrl(this.page);
  }

  get urls(): string[] {
    return Array.from({ length: this.page }).map((_, index) => {
      return this.createUrl(index + 1);
    });
  }

  /** Уникальный ключ ресурса */
  get key(): string {
    return this.createKey();
  }

  /** Уникальные ключи ресурса */
  get keys(): string[] {
    return this.urls.map((url, index) => this.createKey(index + 1, url));
  }

  public copyWith(data: Partial<PaginationResource>): PaginationResource {
    return new PaginationResource(data);
  }

  public nextPage(cursor: number | string): boolean {
    if (
      Object.values(this.cursors).includes(`${cursor}`) ||
      !cursor ||
      cursor === -1
    ) {
      return false;
    }

    this.page = this.page + 1;
    this.cursors[this.page] = `${cursor}`;

    return true;
  }

  public setPage(page: number): void {
    this.page = page;
  }

  public setParams(params: string): void {
    this._url = this.createUrl(this.page, `${this.url}${params}`);
  }

  private createUrl(page: number, fullUrl?: string): string {
    const { url, query } = qs.parseUrl(fullUrl ?? this._url);

    const params = `${PaginationResource.createParams(query)}&${
      PaginationResource.params.limit
    }=${this.limit}`;

    const cursor = this.cursors[page]
      ? `${PaginationResource.params.cursor}=${this.cursors[page]}`
      : '';

    return `${url}?${params}${cursor ? `&${cursor}` : cursor}`;
  }

  private createKey(page?: number, url?: string): string {
    const id = this.id ? `/${this.id}` : '';

    return `[${this.method}]:${this.createUrl(
      page ?? this.page,
      url ?? this._url
    )}${id}`;
  }

  static params: Record<string, string> = {
    cursor: 'last-id',
    limit: 'limit',
  };

  static createParams(query: Record<string, unknown>): string {
    const systemParams = Object.values(PaginationResource.params);

    return Object.keys(query)
      .filter((key) => !systemParams.includes(key))
      .sort((a, b) => a.localeCompare(b))
      .map(
        (param) =>
          `${param}=${encodeURI(query[param] ? `${query[param]}` : '')}`
      )
      .join('&');
  }

  static isInstance(value: unknown): value is PaginationResource {
    return value instanceof PaginationResource;
  }
}
