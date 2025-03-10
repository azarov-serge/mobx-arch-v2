import { action, computed, makeObservable, observable } from 'mobx';
import { RestService } from './rest-service';
import {
  RequestArgs,
  ResourceHelpers,
  PaginationResourceHelpers,
} from './types';
import {
  PaginationResource,
  PaginationResourceInterface,
  PaginationResponse,
  Resource,
  ResourceInterface,
  ResourceParams,
  ResourceStatus,
} from './resources';

export class Domain<T, K extends string> {
  public rest: RestService<T>;
  @observable.deep
  public config: Record<K, RequestArgs<T>>;
  protected helpers: Record<K, ResourceHelpers<unknown>>;
  protected paginationHelpers: Record<K, PaginationResourceHelpers<unknown>>;

  constructor(config: Record<string, RequestArgs<T>>) {
    makeObservable(this);

    this.rest = new RestService();
    this.config = config;
    this.helpers = {} as Record<K, ResourceHelpers<unknown>>;
    this.paginationHelpers = {} as Record<
      K,
      PaginationResourceHelpers<unknown>
    >;
  }

  public getStatus<T>(key: string): T {
    return this.rest.getStatus(key) as T;
  }

  public getPaginationStatus<S>(keys: string[]): S {
    const status = keys.reduce<unknown>((acc, key) => {
      let result = (
        acc as ResourceStatus<PaginationResponse<unknown>>
      ).copyWith() as ResourceStatus<PaginationResponse<unknown>>;

      const pageStatus = this.getStatus(key) as ResourceStatus<
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
    }, new ResourceStatus<PaginationResponse<unknown>>());

    return status as S;
  }

  protected createHelpers<D>(configKey: K): ResourceHelpers<D> {
    if (!this.helpers[configKey]) {
      const fetchData = async (
        args?: ResourceInterface
      ): Promise<ResourceStatus<D>> => {
        const resource = (this.config[configKey].resource as Resource).copyWith(
          args
        );
        const config = {
          ...this.config[configKey],
          resource,
        } as RequestArgs<D>;

        return await this.rest.request<D>(config);
      };

      const clearError = (args?: ResourceInterface): void => {
        const resource = (this.config[configKey].resource as Resource).copyWith(
          args
        );
        this.rest.clearError(resource.key);
      };

      const reset = (args?: ResourceInterface): void => {
        const resource = (this.config[configKey].resource as Resource).copyWith(
          args
        );
        this.rest.reset(resource.key);
      };

      const resetResource = (): void => {
        const resource = this.config[configKey].resource;
        this.rest.reset(resource.keyShort);
      };

      this.setHelpers(configKey, {
        fetchData,
        clearError,
        reset,
        resetResource,
      } as ResourceHelpers<unknown>);
    }

    return this.helpers[configKey] as ResourceHelpers<D>;
  }

  protected createPaginationHelpers<D>(
    configKey: K
  ): PaginationResourceHelpers<D> {
    if (!this.paginationHelpers[configKey]) {
      const fetchData = async (
        args?: PaginationResourceInterface
      ): Promise<ResourceStatus<D>> => {
        const resource = (
          this.config[configKey].resource as PaginationResource
        ).copyWith(args);

        const config = {
          ...this.config[configKey],
          resource,
        } as RequestArgs<D>;

        return await this.rest.request<D>(config);
      };

      const nextPage = (params: ResourceParams) => {
        const resource = this.config[configKey].resource as PaginationResource;
        const result = resource.nextPage(params);
        this.updateResource(configKey, resource.copyWith());

        return result;
      };

      const clearError = (args?: PaginationResourceInterface): void => {
        const resource = this.config[configKey].resource.copyWith(args);
        this.rest.clearError(resource.key);
      };

      const reset = (args?: PaginationResourceInterface): void => {
        const resource = this.config[configKey].resource.copyWith(args);
        this.rest.reset(resource.key);
      };

      const resetResource = (): void => {
        const resource = this.config[configKey].resource;
        this.rest.resetResource(resource.keyShort);
      };

      this.setPaginationHelpers(configKey, {
        fetchData,
        nextPage,
        clearError,
        reset,
        resetResource,
      } as PaginationResourceHelpers<unknown>);
    }

    return this.paginationHelpers[configKey] as PaginationResourceHelpers<D>;
  }

  private updateResource = action(
    (key: string, resource: Resource | PaginationResource): void => {
      //@ts-ignore
      if (this.config[key]) {
        //@ts-ignore
        this.config[key].resource = resource;
      }
    }
  );

  private setHelpers = action(
    (key: K, helpers: ResourceHelpers<unknown>): void => {
      this.helpers[key] = helpers;
    }
  );

  private setPaginationHelpers = action(
    (key: K, helpers: PaginationResourceHelpers<unknown>): void => {
      this.paginationHelpers[key] = helpers;
    }
  );

  @computed
  get statuses() {
    return this.rest.statuses;
  }
}
