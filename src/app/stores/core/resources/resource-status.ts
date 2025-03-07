import { ResourceError } from './resource-error';

export class ResourceStatus<T> {
  public readonly isFetching: boolean = false;
  public readonly isFetched: boolean = false;
  public readonly error: ResourceError | null = null;
  public readonly response: T | null = null;

  constructor(data?: Partial<ResourceStatus<T> | undefined>) {
    this.isFetching = data?.isFetching ?? this.isFetching;
    this.isFetched = data?.isFetched ?? this.isFetched;
    this.error = data?.error ?? this.error;
    this.response = data?.response ?? this.response;
  }

  copyWith = (
    data: Partial<ResourceStatus<T>> | undefined
  ): ResourceStatus<T> => {
    return new ResourceStatus({ ...this, ...data });
  };
}
