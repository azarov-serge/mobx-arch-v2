import { ResourceInterface, ResourceParams } from './types';
import { AbstractResource } from './abstract-resource';

type PageResourceParams = Record<number, ResourceParams>;

type PaginationResourceInterface = ResourceInterface &
  ResourceInterface & {
    id: number | string;
    page?: number;
    pageParams: PageResourceParams;
  };

export class PaginationResource extends AbstractResource {
  public page: number = 1;
  public readonly pageParams: PageResourceParams = {};

  constructor(data?: Partial<PaginationResourceInterface>) {
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
    data?: PaginationResourceInterface
  ): PaginationResource => {
    return new PaginationResource({ ...this, ...(data ?? {}) });
  };

  public nextPage = (params: ResourceParams): boolean => {
    const currentParams = PaginationResource.createParams({
      ...this.params,
      ...(this.pageParams[this.page] ?? {}),
    });

    const newParams = PaginationResource.createParams(params);

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

  static isInstance(value: unknown): value is PaginationResource {
    return value instanceof PaginationResource;
  }
}
