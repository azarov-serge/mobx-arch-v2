import qs, { StringifyOptions } from 'query-string';
import { ResourceInterface, ResourceMethod, ResourceParams } from './types';

export abstract class AbstractResource implements ResourceInterface {
  public readonly id: string = '';
  public readonly url: string = '';
  public readonly method: ResourceMethod = 'GET';
  public params: ResourceParams = {};

  constructor(data?: Partial<ResourceInterface>) {
    this.id = `${data?.id ?? this.id}`;
    this.method = data?.method ?? this.method;
    this.params = data?.params ?? this.params;
    this.url = data?.url ?? this.url;
  }

  /** Уникальный ключ ресурса */
  get key(): string {
    return this.createKey();
  }

  /** URL для получения данных */
  get requestUrl(): string {
    return this.createUrl();
  }

  public getParamsValue = <T>(key: string, defaultValue?: T): T => {
    return (this.params[key] ?? defaultValue) as T;
  };

  public copyWith(data: unknown): unknown {
    throw Error(`This is abstract method with ${JSON.stringify(data)}`);
  }

  protected createUrl = (params?: ResourceParams): string => {
    const query = AbstractResource.createParams(params ?? this.params);
    return `${this.url}${query ? `?${query}` : ''}`;
  };

  protected createKey = (url?: string, params?: ResourceParams): string => {
    const id = this.id ? `/${this.id}` : '';

    return `[${this.method}]:${url ?? this.createUrl(params)}${id}`;
  };

  static createUrlString(data: string): string {
    const { url, query } = qs.parseUrl(data);

    if (!query) {
      return url;
    }

    return `${url}?${AbstractResource.createParams(query)}`;
  }

  /** Использует qs.stringify. Сортирует ключи и конвертирует в query строку
   * @description
   * @param query
   * @param options
   * @returns
   */
  static createParams(
    query: Record<string, unknown>,
    options?: StringifyOptions
  ): string {
    if (JSON.stringify(query) === '{}') {
      return '';
    }

    return qs.stringify(
      Object.keys(query)
        .sort((a, b) => a.localeCompare(b))
        .reduce<Record<string, unknown>>((acc, key) => {
          acc[key] = Array.isArray(query[key])
            ? query[key].sort((a, b) =>
                JSON.stringify(a).localeCompare(JSON.stringify(b))
              )
            : query[key];

          return acc;
        }, {}),
      options
    );
  }
}
