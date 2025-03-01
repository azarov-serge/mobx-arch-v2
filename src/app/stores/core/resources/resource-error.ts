import { ResourceErrorData } from './types';

export class ResourceError implements ResourceErrorData {
  public readonly status: number;
  public readonly message: string;

  constructor(data: ResourceErrorData) {
    this.status = data.status;
    this.message = data.message;
  }
}
