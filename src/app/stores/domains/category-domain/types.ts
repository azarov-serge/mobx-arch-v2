import { config } from './constants';

export type CategoryResponse = { strCategory: string };

export type Categories = string[];

export type CategoryDomainKey = keyof typeof config;

export type CategoryDomainType = Categories;
