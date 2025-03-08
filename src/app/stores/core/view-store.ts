import { toJS } from 'mobx';
import { FetchResource } from './fetch-resource';
import { PaginationResponse, ResourceStatus } from './resources';
import { CreateResourceHelpersReturnData } from './types';

export class View<S> {
  private readonly _service: FetchResource<unknown>;

  constructor(service: S) {
    this._service = service as FetchResource<unknown>;
  }

  get service(): S {
    return this._service as unknown as S;
  }

  public getStatus<T>(key: string): T {
    return this._service.rest.getStatus(key) as T;
  }

  public getPaginationStatus<S>(keys: string[]): S {
    const status = keys.reduce<unknown>((acc, key) => {
      let result = (
        acc as ResourceStatus<PaginationResponse<unknown>>
      ).copyWith() as ResourceStatus<PaginationResponse<unknown>>;

      const pageStatus = this.getStatus(key) as ResourceStatus<
        PaginationResponse<unknown>
      >;

      if (pageStatus.response) {
        const data = [
          ...(result?.response?.data ?? []),
          ...(pageStatus.response?.data ?? []),
        ];

        result = result.copyWith({
          ...result,
          ...pageStatus,

          response: {
            ...result.response,
            ...(pageStatus.response ?? {}),
            data,
          },
        });
      } else {
        result = result.copyWith({
          ...result,
          ...pageStatus,
          response: {
            count: 0,
            lastId: 0,
            page: 0,
            limit: 0,
            data: [],
            ...(result.response ?? {}),
          },
        });
      }

      return result;
    }, new ResourceStatus<PaginationResponse<unknown>>());

    return status as S;
  }

  public createResourceHelpers(
    keys: string[] | string,
    key?: string
  ): CreateResourceHelpersReturnData {
    const clearError = () => this._service.rest.clearError(keys);
    const reset = () => this._service.rest.reset(keys);
    const resetResource = key
      ? () => this._service.rest.resetResource(key)
      : () => {};

    return { clearError, reset, resetResource };
  }
}
