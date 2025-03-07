import qs from 'query-string';
import { ResourceInterface, ResourceMethod } from './types';

export class Resource implements ResourceInterface {
  public readonly id: string = '';
  public readonly url: string = '';
  public readonly method: ResourceMethod = 'GET';

  constructor(data?: Partial<ResourceInterface & { id: number | string }>) {
    this.id = `${data?.id ?? this.id}`;
    this.method = data?.method ?? this.method;
    this.url = data?.url ? this.createUrl(data?.url) : this.url;
  }

  /** Уникальный ключ ресурса */
  get key(): string {
    const id = this.id ? `/${this.id}` : '';

    return `[${this.method}]:${this.url}${id}`;
  }

  public copyWith = (data: Partial<Resource>): Resource => {
    return new Resource({ ...this, ...data });
  };

  private createUrl(data: string): string {
    const { url, query } = qs.parseUrl(data);

    if (!query) {
      return url;
    }

    return `${url}?${Resource.createParams(query)}`;
  }

  static createParams(query: Record<string, unknown>): string {
    return Object.keys(query)
      .sort((a, b) => a.localeCompare(b))
      .map(
        (param) =>
          `${param}=${encodeURI(query[param] ? `${query[param]}` : '')}`
      )
      .join('&');
  }

  static isInstance(value: unknown): value is Resource {
    return value instanceof Resource;
  }
}
