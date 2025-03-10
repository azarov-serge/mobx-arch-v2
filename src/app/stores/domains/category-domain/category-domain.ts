import { makeObservable } from 'mobx';

import { Domain, Resource, ResourceStatus } from '../../core';
import { Helpers } from '../types';
import { config } from './constants';
import { CategoryDomainType, Categories, CategoryDomainKey } from './types';

export class CategoryDomain extends Domain<
  CategoryDomainType,
  CategoryDomainKey
> {
  constructor() {
    super(config);
    makeObservable(this);
  }

  public getCategoriesData(): Helpers<Categories> {
    const resource = this.config.categories.resource as Resource;
    const status = this.getStatus<ResourceStatus<Categories>>(resource.key);

    const helpers = this.createHelpers<Categories>('categories');

    return { ...status, ...helpers };
  }
}

export const categoryDomain = new CategoryDomain();
