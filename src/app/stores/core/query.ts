import { computed, makeObservable } from 'mobx';
import { RestService } from './rest-service';
import { ResourceHelpers } from './types';
import { PaginationResponse, ResourceStatus } from './resources';

export class Query<T> {
  public rest: RestService<T>;

  constructor() {
    makeObservable(this);

    this.rest = new RestService();
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

  public createResourceHelpers<D>(
    getData: () => Promise<ResourceStatus<D>>,
    keys: string[] | string,
    key?: string
  ): ResourceHelpers<D> {
    const clearError = () => this.rest.clearError(keys);
    const reset = () => this.rest.reset(keys);
    const resetResource = key ? () => this.rest.resetResource(key) : () => {};

    return { getData, clearError, reset, resetResource };
  }

  @computed
  get statuses() {
    return this.rest.statuses;
  }
}
