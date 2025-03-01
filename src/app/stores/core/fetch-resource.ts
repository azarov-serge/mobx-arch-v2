import { computed, makeObservable } from 'mobx';
import { RestService } from './rest-service';
import {} from './types';

export class FetchResource<T> {
  public rest: RestService<T>;

  constructor() {
    makeObservable(this);

    this.rest = new RestService();
  }

  @computed
  get statuses() {
    return this.rest.statuses;
  }
}
