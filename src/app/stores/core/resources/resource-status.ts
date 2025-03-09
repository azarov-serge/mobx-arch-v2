import { ResourceError } from './resource-error';

export class ResourceStatus<T> {
  public readonly isFetching: boolean = false;
  public readonly isFetched: boolean = false;
  public readonly data: T | null = null;
  public readonly error: ResourceError | null = null;

  constructor(data?: Partial<ResourceStatus<T> | undefined>) {
    this.isFetching = data?.isFetching ?? this.isFetching;
    this.isFetched = data?.isFetched ?? this.isFetched;
    this.data = data?.data ?? this.data;
    this.error = data?.error ?? this.error;
  }

  public copyWith = (
    data?: Partial<ResourceStatus<T>> | undefined
  ): ResourceStatus<T> => {
    return new ResourceStatus({ ...this, ...data });
  };
}
