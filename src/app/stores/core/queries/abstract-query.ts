import qs, { StringifyOptions } from 'query-string';
import { QueryInterface, QueryMethod, QueryParams } from './types';

export abstract class AbstractQuery implements QueryInterface {
  public readonly id: string = '';
  public readonly baseUrl: string = '';
  public readonly method: QueryMethod = 'GET';
  public params: QueryParams = {};
  public urlParam: string = '';

  constructor(data?: Partial<QueryInterface>) {
    this.id = `${data?.id || this.id}`;
    this.method = data?.method || this.method;
    this.params = { ...(data?.params ?? this.params) };
    this.baseUrl = data?.baseUrl || data?.url || this.baseUrl;
    this.urlParam = data?.urlParam || this.urlParam;
  }

  /** Уникальный ключ ресурса */
  get key(): string {
    return this.createKey();
  }

  /**  Может использоваться для очистки состояния если, есть поиск типа search=*/
  get keyShort(): string {
    return `[${this.method}]:${this.baseUrl}`;
  }

  /** URL для получения данных */
  get url(): string {
    return this.createUrl();
  }

  public getParamsValue = <T>(key: string, defaultValue?: T): T => {
    return (this.params[key] ?? defaultValue) as T;
  };

  public copyWith(data: unknown): unknown {
    throw Error(`This is abstract method with ${JSON.stringify(data)}`);
  }

  protected createUrl = (params?: QueryParams): string => {
    const query = AbstractQuery.createParams(params ?? this.params);

    return `${this.baseUrl}${this.urlParam}${query ? `?${query}` : ''}`;
  };

  protected createKey = (url?: string, params?: QueryParams): string => {
    const id = this.id ? `/${this.id}` : '';

    return `[${this.method}]:${url ?? this.createUrl(params)}${id}`;
  };

  static createUrlString(data: string): string {
    const { url, query } = qs.parseUrl(data);

    if (!query) {
      return url;
    }

    return `${url}?${AbstractQuery.createParams(query)}`;
  }

  /** Использует qs.stringify. Сортирует ключи и конвертирует в query строку
   * @description
   * @param query
   * @param options
   * @returns
   */
  static createParams(
    params: Record<string, unknown>,
    options?: StringifyOptions
  ): string {
    if (JSON.stringify(params) === '{}') {
      return '';
    }

    return qs.stringify(
      Object.keys(params)
        // Убирать пустые параметры
        .filter((key) => params[key] !== undefined && params[key] !== '')
        .sort((a, b) => a.localeCompare(b))
        .reduce<Record<string, unknown>>((acc, key) => {
          acc[key] = Array.isArray(params[key])
            ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              params[key].sort((a, b) =>
                JSON.stringify(a).localeCompare(JSON.stringify(b))
              )
            : params[key];

          return acc;
        }, {}),
      options
    );
  }
}
