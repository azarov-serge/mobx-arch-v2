import { ResourceInterface } from './types';
import { AbstractResource } from './abstract-resource';

export class Resource extends AbstractResource {
  public copyWith = (data?: Partial<ResourceInterface>): Resource => {
    return new Resource({ ...this, ...data });
  };

  static isInstance(value: unknown): value is Resource {
    return value instanceof Resource;
  }
}
