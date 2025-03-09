import { observable, makeAutoObservable, action } from 'mobx';

import { RequestArgs, Statuses } from './types';
import { Resource, ResourceError, ResourceStatus } from './resources';
import { delay, isAxiosResponse } from '../../../share';
import axios, { AxiosResponse } from 'axios';
import { axiosInstance } from '../instances';

const DEFAULT_DELAY_MS = 300;

export class RestService<T> {
  @observable.deep
  statuses: Statuses<T> = {};

  constructor() {
    makeAutoObservable(this);
  }

  public getStatus = <T>(key: string): ResourceStatus<T> => {
    const status = this.statuses[key];

    if (!status) {
      return new ResourceStatus();
    }

    return status as unknown as ResourceStatus<T>;
  };

  public setStatus = action((key: string, status: ResourceStatus<T>): void => {
    this.statuses[key] = status;
  });

  public reset(keys: string | string[]): void {
    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        delete this.statuses[key];
      });

      return;
    }

    delete this.statuses[keys];
  }

  public resetResource = (key: string): void => {
    Object.keys(this.statuses).forEach((statusKey) => {
      if (!statusKey.includes(key)) {
        return;
      }

      delete this.statuses[statusKey];
    });
  };

  public resetAll = (): void => {
    this.statuses = {};
  };

  public clearError = (keys: string[] | string): void => {
    if (Array.isArray(keys)) {
      keys.forEach((key) => {
        const status = this.statuses[key] ?? new ResourceStatus();

        this.statuses[key] = status.copyWith({ error: null });
      });

      return;
    }

    const status = this.statuses[keys] ?? new ResourceStatus();

    this.statuses[keys] = status.copyWith({ error: null });
  };

  public request = async <R>(
    args: RequestArgs<R>
  ): Promise<ResourceStatus<R>> => {
    const { resource, data, fetch, adaptResponse, mock } = args;

    let params = '';

    if (params) {
      params = `?${
        typeof args.params === 'string'
          ? params
          : Resource.createParams(args.params ?? {})
      }`;
    }

    let status = this.getStatus<R>(resource.key);

    if (status.isFetching && resource.method === 'GET') {
      return status as unknown as ResourceStatus<R>;
    }

    status = status.copyWith({ isFetching: true, error: null });

    this.setStatus(resource.key, status as unknown as ResourceStatus<T>);

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(args?.headers ?? {}),
    };

    if (mock) {
      await delay(mock?.delay || DEFAULT_DELAY_MS);
      status = status.copyWith({
        response: mock.data,
        isFetched: true,
        isFetching: false,
      });

      this.setStatus(resource.key, status as unknown as ResourceStatus<T>);

      return status;
    }

    try {
      const request: Promise<R | AxiosResponse<R>> = fetch
        ? fetch(args)
        : axiosInstance({
            url: resource.requestUrl,
            method: resource.method,
            headers,
            data,
          });

      const response = await request;

      const responseData = isAxiosResponse(response) ? response.data : response;

      status = status.copyWith({
        response: adaptResponse ? adaptResponse(responseData) : responseData,
        isFetched: true,
        isFetching: false,
      });

      this.setStatus(resource.key, status as unknown as ResourceStatus<T>);

      return status;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        status = status.copyWith({
          error: new ResourceError({
            status: error.status ?? 500,
            message: error.message,
          }),
        });
      } else if (error instanceof Error) {
        status = status.copyWith({
          error: new ResourceError({
            status: 500,
            message: error.message,
          }),
        });
      } else {
        status = status.copyWith({
          error: new ResourceError({
            status: 500,
            message: JSON.stringify(error),
          }),
        });
      }

      status = status.copyWith({
        isFetched: true,
        isFetching: false,
      });

      this.setStatus(resource.key, status as unknown as ResourceStatus<T>);

      return status;
    }
  };
}
